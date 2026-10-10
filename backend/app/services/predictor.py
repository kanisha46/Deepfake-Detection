import time
import torch
import torch.nn.functional as F
from PIL import Image
from typing import Dict, Any, Optional

from app.models.model_loader import registry
from app.services.preprocessor import preprocess_image
from app.services.gradcam import generate_gradcam_overlay
from app.config import DEFAULT_THRESHOLDS, INCONCLUSIVE_MARGIN

def run_prediction(
    image: Image.Image,
    model_id: Optional[str] = None,
    generate_gradcam: bool = False,
    custom_threshold: Optional[float] = None
) -> Dict[str, Any]:
    model, resolved_model_id = registry.get_model(model_id)
    
    if model is None:
        raise ValueError(
            f"Requested model '{model_id}' is not loaded or has no valid checkpoint. "
            f"Available models: {list(registry.models.keys())}"
        )

    # Determine decision threshold
    threshold = (
        custom_threshold
        if custom_threshold is not None
        else DEFAULT_THRESHOLDS.get(resolved_model_id, 0.5)
    )

    # Preprocess
    input_tensor, processed_pil = preprocess_image(image, auto_face_crop=False)
    input_tensor = input_tensor.to(registry.device)

    # Time inference
    start_time = time.perf_counter()
    with torch.no_grad():
        logits = model(input_tensor)
        probs = F.softmax(logits, dim=1)[0]
    inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

    prob_real = float(probs[0].item())
    prob_fake = float(probs[1].item())

    # Decision policy
    dist_from_threshold = abs(prob_fake - threshold)
    is_inconclusive = dist_from_threshold < INCONCLUSIVE_MARGIN

    if is_inconclusive:
        prediction = "INCONCLUSIVE"
        confidence_val = round(max(prob_real, prob_fake) * 100, 2)
        confidence_score = round(max(prob_real, prob_fake), 4)
        message = (
            f"Prediction is inconclusive (|P(Fake) - {threshold}| < {INCONCLUSIVE_MARGIN}). "
            "The model cannot make a definitive determination."
        )
        explanation = (
            "The classifier's output falls within the uncertainty margin near the decision threshold. "
            "In forensic evaluation, uncertain predictions are classified as inconclusive to prevent false accusations."
        )
    elif prob_fake >= threshold:
        prediction = "FAKE"
        confidence_val = round(prob_fake * 100, 2)
        confidence_score = round(prob_fake, 4)
        message = "The model detected structural and frequency artifacts characteristic of synthetic/manipulated imagery."
        explanation = (
            f"Predicted FAKE with {confidence_val}% probability. "
            f"P(Fake)={prob_fake:.4f} exceeds the calibrated threshold of {threshold:.3f}."
        )
    else:
        prediction = "REAL"
        confidence_val = round(prob_real * 100, 2)
        confidence_score = round(prob_real, 4)
        message = "The model found natural biometric and photographic consistency typical of authentic images."
        explanation = (
            f"Predicted REAL with {confidence_val}% probability. "
            f"P(Fake)={prob_fake:.4f} is below the calibrated threshold of {threshold:.3f}."
        )

    # Grad-CAM if requested
    gradcam_base64 = None
    gradcam_note = None
    if generate_gradcam:
        target_class = 1 if prob_fake >= threshold else 0
        gradcam_base64, gradcam_note = generate_gradcam_overlay(
            model=model,
            model_id=resolved_model_id,
            input_tensor=input_tensor,
            original_pil=processed_pil,
            target_class_idx=target_class
        )
        if gradcam_note and not is_inconclusive:
            explanation = f"{explanation} {gradcam_note}"

    display_name = "EfficientNet-B0" if resolved_model_id == "efficientnet_b0" else "Vision Transformer (ViT-B/16)"

    return {
        "prediction": prediction,
        "confidence": confidence_val,
        "confidence_score": confidence_score,
        "probabilities": {
            "real": round(prob_real, 4),
            "ai_generated": round(prob_fake, 4)
        },
        "model": display_name,
        "model_id": resolved_model_id,
        "threshold": threshold,
        "inference_time_ms": inference_time_ms,
        "message": message,
        "explanation": explanation,
        "model_status": "PRODUCTION_CHECKPOINT",
        "gradcam_image_base64": gradcam_base64,
        "is_inconclusive": is_inconclusive
    }
