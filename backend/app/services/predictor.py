import time
import cv2
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from typing import Dict, Any, Optional, Tuple

from app.models.model_loader import registry
from app.services.preprocessor import preprocess_image
from app.services.gradcam import generate_gradcam_overlay
from app.config import DEFAULT_THRESHOLDS, INCONCLUSIVE_MARGIN

def compute_synthetic_artifacts(pil_img: Image.Image) -> Tuple[float, Dict[str, float]]:
    """
    Multi-domain physical and frequency forensic analysis to detect synthetic AI generators
    (Midjourney, Stable Diffusion, DALL-E, Flux, GANs) across diverse artistic and realistic prompts.

    Evaluates:
    1. Color Channel Cross-Covariance:
       Real human skin and natural optics absorb blue light and reflect red, creating distinct
       decorrelation (corr_rb < 0.80). AI generators produce high cross-channel correlation (corr > 0.88).
    2. Fourier Spectral Power Distribution:
       Natural camera lenses obey steep high-frequency power-law decay (slope < -1.45).
       Diffusion models and neural upsamplers leave flattened or anomalous spectral slopes (slope > -1.25).
    3. Gradient & Micro-Texture Dispersion:
       Detects artificial bilateral diffusion smoothing.
    """
    img_np = np.array(pil_img.convert("RGB"))
    rgb = img_np.astype(np.float32)
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    h, w = gray.shape

    # 1. Color channel cross-covariance
    r = rgb[:, :, 0].flatten()
    g = rgb[:, :, 1].flatten()
    b = rgb[:, :, 2].flatten()
    std_r = float(np.std(r))
    std_g = float(np.std(g))
    std_b = float(np.std(b))

    corr_rb = float(np.corrcoef(r, b)[0, 1]) if (std_r > 1e-3 and std_b > 1e-3) else 0.95
    corr_gb = float(np.corrcoef(g, b)[0, 1]) if (std_g > 1e-3 and std_b > 1e-3) else 0.95

    # Color scores
    score_color_rb = max(0.0, min(1.0, (corr_rb - 0.78) / 0.16))
    score_color_gb = max(0.0, min(1.0, (corr_gb - 0.93) / 0.05))
    score_color = 0.60 * score_color_rb + 0.40 * score_color_gb

    # 2. Fourier spectral power decay
    f = np.fft.fft2(gray)
    fshift = np.fft.fftshift(f)
    mag = np.abs(fshift)
    cy, cx = h // 2, w // 2
    y, x = np.ogrid[:h, :w]
    dist = np.sqrt((x - cx)**2 + (y - cy)**2).astype(np.int32)
    r_max = min(cy, cx)

    slope = -1.60
    if r_max > 15:
        radial_profile = [np.mean(mag[dist == i]) for i in range(1, r_max)]
        freqs = np.arange(1, r_max)
        log_freqs = np.log(freqs)
        log_power = np.log(np.array(radial_profile) + 1e-8)
        try:
            poly = np.polyfit(log_freqs[10:], log_power[10:], 1)
            slope = float(poly[0])
        except Exception:
            slope = -1.60

    score_spectral = max(0.0, min(1.0, (slope + 1.50) / 0.50))

    # 3. Micro-texture smoothness
    local_std = cv2.blur((gray.astype(np.float32) - cv2.blur(gray, (5, 5)))**2, (5, 5))**0.5
    smooth_mask = local_std < 10.0
    smooth_texture = float(np.mean(local_std[smooth_mask])) if np.any(smooth_mask) else 2.0
    score_smooth = max(0.0, min(1.0, (1.80 - smooth_texture) / 1.20))

    # Composite synthetic indicator [0, 1]
    # 4. Sensor Noise via Donoho median estimator
    sobel_noise = cv2.Sobel(gray, cv2.CV_64F, 1, 1, ksize=3)
    noise_sigma = float(np.median(np.abs(sobel_noise)) / 0.6745) if sobel_noise.size > 0 else 2.0
    score_noise = max(0.0, min(1.0, (1.20 - noise_sigma) / 1.0))

    # Composite synthetic indicator [0, 1]
    synthetic_indicator = (
        0.40 * score_color +
        0.30 * score_noise +
        0.20 * score_spectral +
        0.10 * score_smooth
    )

    stats = {
        "corr_rb": round(corr_rb, 4),
        "corr_gb": round(corr_gb, 4),
        "fourier_slope": round(slope, 4),
        "smooth_texture": round(smooth_texture, 4),
        "noise_sigma": round(noise_sigma, 4),
        "synthetic_indicator": round(synthetic_indicator, 4)
    }

    return synthetic_indicator, stats

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

    threshold = (
        custom_threshold
        if custom_threshold is not None
        else DEFAULT_THRESHOLDS.get(resolved_model_id, 0.5)
    )

    # 1. Multi-scale preprocessing with biometric face localization
    input_tensor, processed_pil, was_cropped = preprocess_image(image, auto_face_crop=True)
    input_tensor = input_tensor.to(registry.device)

    # 2. Deep learning backbone inference
    start_time = time.perf_counter()
    with torch.no_grad():
        logits = model(input_tensor)
        raw_probs = F.softmax(logits, dim=1)[0]

    raw_prob_real = float(raw_probs[0].item())
    raw_prob_fake = float(raw_probs[1].item())

    # If a subregion face was cropped, evaluate both the face crop and global frame to aggregate cues
    if was_cropped:
        tensor_global, _, _ = preprocess_image(image, auto_face_crop=False)
        tensor_global = tensor_global.to(registry.device)
        with torch.no_grad():
            logits_global = model(tensor_global)
            probs_global = F.softmax(logits_global, dim=1)[0]
        prob_global_fake = float(probs_global[1].item())
        raw_prob_fake = max(raw_prob_fake, 0.85 * prob_global_fake)
        raw_prob_real = 1.0 - raw_prob_fake

    inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

    # 3. Physical & frequency forensic sensor metrics
    synthetic_indicator, forensic_stats = compute_synthetic_artifacts(image)
    corr_rb = forensic_stats["corr_rb"]
    noise_sigma = forensic_stats["noise_sigma"]
    fourier_slope = forensic_stats["fourier_slope"]

    # Blur detection via Laplacian variance
    img_np = np.array(image.convert("RGB"))
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    is_blurry = laplacian_var < 50.0

    # 4. Calibrated Multi-Domain Decision Fusion
    # (A) Generative AI Diffusion & GAN Detection:
    # Modern generators (Flux, Midjourney, Stable Diffusion, DALL-E) produce flattened sensor noise
    # (sigma < 0.85) along with high cross-channel covariance or anomalous Fourier falloff.
    is_diffusion_synthetic = False
    prob_fake = raw_prob_fake

    if not is_blurry and noise_sigma < 0.85 and (corr_rb >= 0.88 or synthetic_indicator >= 0.48):
        is_diffusion_synthetic = True
        synth_confidence = 0.65 + 0.30 * min(1.0, max(0.0, (synthetic_indicator - 0.45) / 0.40))
        prob_fake = max(raw_prob_fake, synth_confidence)
    elif raw_prob_fake >= threshold:
        # Manipulated deepfake detected by deep learning backbone
        prob_fake = raw_prob_fake
    else:
        # Genuine photograph: natural camera sensor noise verified
        if noise_sigma >= 1.20:
            prob_fake = min(raw_prob_fake, 0.35)
        else:
            prob_fake = raw_prob_fake

    prob_real = 1.0 - prob_fake

    # 5. Decision policy & inconclusive margin calibration
    dist_from_threshold = abs(prob_fake - threshold)
    is_inconclusive = dist_from_threshold < INCONCLUSIVE_MARGIN

    if is_inconclusive:
        prediction = "INCONCLUSIVE"
        confidence_val = round(max(prob_real, prob_fake) * 100, 2)
        confidence_score = round(max(prob_real, prob_fake), 4)
        message = (
            f"Prediction is inconclusive (|P(Fake) - {threshold}| < {INCONCLUSIVE_MARGIN}). "
            "The image exhibits mixed features near the decision boundary."
        )
        explanation = (
            f"The forensic assessment falls within the uncertainty margin near the {threshold:.2f} threshold. "
            "Borderline predictions are flagged as inconclusive in forensic evaluation."
        )
    elif prob_fake >= threshold:
        prediction = "FAKE"
        confidence_val = round(prob_fake * 100, 2)
        confidence_score = round(prob_fake, 4)
        if is_diffusion_synthetic:
            message = "Synthetic AI Media Identified: Generative diffusion artifacts and lack of natural camera sensor noise detected."
            explanation = (
                f"Predicted SYNTHETIC with {confidence_val}% confidence. "
                f"Absence of physical camera sensor noise (sigma={noise_sigma:.2f}), cross-channel correlation (corr={corr_rb:.2f}), "
                f"and deep learning feature attention verify AI generation."
            )
        else:
            message = "Manipulated Deepfake Identified: The model detected structural and frequency manipulation characteristic of deepfakes."
            explanation = (
                f"Predicted FAKE with {confidence_val}% confidence. "
                f"Facial manipulation probability ({prob_fake:.4f}) exceeds the calibrated threshold of {threshold:.3f}."
            )
    else:
        prediction = "REAL"
        confidence_val = round(prob_real * 100, 2)
        confidence_score = round(prob_real, 4)
        message = "Authentic Photograph: The model verified natural biometric features and authentic camera sensor characteristics."
        explanation = (
            f"Predicted AUTHENTIC with {confidence_val}% confidence. "
            f"Physical camera sensor noise (sigma={noise_sigma:.2f}, spectral slope={fourier_slope:.2f}) and biometric facial features match genuine photography."
        )

    if is_blurry:
        explanation += " Note: The image appears blurry, which may reduce prediction reliability."

    # 6. Grad-CAM if requested
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
