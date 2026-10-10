import io
import base64
import cv2
import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from typing import Optional, Tuple

class GradCAM:
    def __init__(self, model: nn.Module, target_layer: nn.Module):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        self.hook_handles = []
        self._register_hooks()

    def _register_hooks(self):
        def forward_hook(module, input, output):
            self.activations = output.detach()

        def backward_hook(module, grad_in, grad_out):
            self.gradients = grad_out[0].detach()

        self.hook_handles.append(self.target_layer.register_forward_hook(forward_hook))
        self.hook_handles.append(self.target_layer.register_full_backward_hook(backward_hook))

    def remove_hooks(self):
        for handle in self.hook_handles:
            handle.remove()
        self.hook_handles = []

    def generate(self, input_tensor: torch.Tensor, class_idx: int) -> np.ndarray:
        self.model.zero_grad()
        output = self.model(input_tensor)
        
        # Target score
        score = output[0, class_idx]
        score.backward(retain_graph=True)
        
        # Global average pool of gradients
        weights = torch.mean(self.gradients, dim=(2, 3), keepdim=True)
        cam = torch.sum(weights * self.activations, dim=1, keepdim=True)
        cam = torch.relu(cam)
        
        cam = cam.squeeze().cpu().numpy()
        if np.max(cam) > 0:
            cam = (cam - np.min(cam)) / (np.max(cam) - np.min(cam) + 1e-8)
        else:
            cam = np.zeros_like(cam)
            
        return cam

def generate_gradcam_overlay(
    model: nn.Module,
    model_id: str,
    input_tensor: torch.Tensor,
    original_pil: Image.Image,
    target_class_idx: int
) -> Tuple[Optional[str], Optional[str]]:
    """
    Generates a Grad-CAM heatmap visualization for CNN models (e.g. EfficientNet-B0).
    For ViT models, returns None with an honest scientific explanation.
    """
    if model_id != "efficientnet_b0":
        return None, "ViT utilizes multi-head self-attention token projections rather than 2D spatial feature convolutions. Standard Grad-CAM is architecturally inapplicable without specialized patch-attention rollout."

    try:
        # Target last convolutional block in EfficientNet-B0
        target_layer = model.features[-1]
        cam_extractor = GradCAM(model, target_layer)
        
        tensor_clone = input_tensor.clone().requires_grad_(True)
        cam = cam_extractor.generate(tensor_clone, target_class_idx)
        cam_extractor.remove_hooks()
        
        # Resize CAM to image size
        cam_resized = cv2.resize(cam, (original_pil.width, original_pil.height))
        heatmap = np.uint8(255 * cam_resized)
        heatmap_colored = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        heatmap_rgb = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
        
        original_np = np.array(original_pil)
        blended = cv2.addWeighted(original_np, 0.6, heatmap_rgb, 0.4, 0)
        
        result_img = Image.fromarray(blended)
        buffered = io.BytesIO()
        result_img.save(buffered, format="JPEG", quality=90)
        base64_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return f"data:image/jpeg;base64,{base64_str}", "Grad-CAM highlights regions contributing most heavily to the model's prediction. Note that activations are explanatory cues, not definitive proof of manipulation."
    except Exception as e:
        return None, f"Failed to compute Grad-CAM: {str(e)}"
