import logging
import torch
import torch.nn as nn
from torchvision.models import efficientnet_b0, vit_b_16
from typing import Dict, Optional, Tuple

from app.config import (
    EFFNET_CHECKPOINT_PATH,
    VIT_CHECKPOINT_PATH,
    DEVICE,
    DEFAULT_THRESHOLDS
)

logger = logging.getLogger("deepfake_backend.model_loader")

class ModelRegistry:
    def __init__(self):
        self.device = torch.device(DEVICE if torch.cuda.is_available() and DEVICE == "cuda" else "cpu")
        self.models: Dict[str, nn.Module] = {}
        self.active_model_id: str = "efficientnet_b0"
        self._load_all_available_models()

    def _load_all_available_models(self):
        logger.info(f"Using compute device: {self.device}")
        
        # 1. Load EfficientNet-B0
        if EFFNET_CHECKPOINT_PATH and EFFNET_CHECKPOINT_PATH.exists():
            try:
                logger.info(f"Loading EfficientNet-B0 from {EFFNET_CHECKPOINT_PATH}...")
                model_eff = efficientnet_b0(num_classes=2)
                state_dict = torch.load(str(EFFNET_CHECKPOINT_PATH), map_location="cpu")
                model_eff.load_state_dict(state_dict, strict=True)
                model_eff.to(self.device)
                model_eff.eval()
                # Warmup
                with torch.no_grad():
                    dummy = torch.zeros(1, 3, 224, 224, device=self.device)
                    _ = model_eff(dummy)
                self.models["efficientnet_b0"] = model_eff
                logger.info("EfficientNet-B0 loaded and verified successfully.")
            except Exception as e:
                logger.error(f"Failed to load EfficientNet-B0: {e}", exc_info=True)
        else:
            logger.warning(f"EfficientNet-B0 checkpoint not found at {EFFNET_CHECKPOINT_PATH}")

        # 2. Load Vision Transformer (ViT-B/16)
        if VIT_CHECKPOINT_PATH and VIT_CHECKPOINT_PATH.exists():
            try:
                logger.info(f"Loading ViT-B/16 from {VIT_CHECKPOINT_PATH}...")
                model_vit = vit_b_16(num_classes=2)
                state_dict = torch.load(str(VIT_CHECKPOINT_PATH), map_location="cpu")
                model_vit.load_state_dict(state_dict, strict=True)
                model_vit.to(self.device)
                model_vit.eval()
                # Warmup
                with torch.no_grad():
                    dummy = torch.zeros(1, 3, 224, 224, device=self.device)
                    _ = model_vit(dummy)
                self.models["vit"] = model_vit
                logger.info("ViT-B/16 loaded and verified successfully.")
            except Exception as e:
                logger.error(f"Failed to load ViT-B/16: {e}", exc_info=True)
        else:
            logger.warning(f"ViT-B/16 checkpoint not found at {VIT_CHECKPOINT_PATH}")

        # If efficientnet is not loaded but vit is, fallback active model
        if "efficientnet_b0" not in self.models and "vit" in self.models:
            self.active_model_id = "vit"

    def get_model(self, model_id: Optional[str] = None) -> Tuple[Optional[nn.Module], str]:
        target_id = model_id or self.active_model_id
        # Normalize aliases
        if target_id in ["vit_b_16", "vit-b/16", "vision_transformer"]:
            target_id = "vit"
        elif target_id in ["efficientnet", "efficientnet-b0"]:
            target_id = "efficientnet_b0"

        model = self.models.get(target_id)
        return model, target_id

    def set_active_model(self, model_id: str) -> bool:
        if target_id := ("vit" if model_id in ["vit", "vit_b_16", "vit-b/16"] else model_id):
            if target_id in self.models:
                self.active_model_id = target_id
                return True
        return False

    def is_loaded(self, model_id: str) -> bool:
        return model_id in self.models

registry = ModelRegistry()
