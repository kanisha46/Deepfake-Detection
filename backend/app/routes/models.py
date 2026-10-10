from fastapi import APIRouter, HTTPException
from app.models.model_loader import registry
from app.config import (
    EFFNET_CHECKPOINT_PATH,
    VIT_CHECKPOINT_PATH,
    DEFAULT_THRESHOLDS
)
from app.schemas import ModelsListResponse, ModelMetadata, SelectModelRequest, SelectModelResponse

router = APIRouter(prefix="/models", tags=["Models"])

@router.get("", response_model=ModelsListResponse)
def list_models():
    models_metadata = [
        ModelMetadata(
            id="efficientnet_b0",
            name="EfficientNet-B0 (CNN Backbone)",
            architecture="EfficientNet-B0 (TorchVision)",
            status="VERIFIED_CHECKPOINT" if registry.is_loaded("efficientnet_b0") else "UNAVAILABLE",
            checkpoint_available=registry.is_loaded("efficientnet_b0"),
            checkpoint_path=str(EFFNET_CHECKPOINT_PATH) if EFFNET_CHECKPOINT_PATH else None,
            default_threshold=DEFAULT_THRESHOLDS.get("efficientnet_b0", 0.50),
            description="Compound-scaled convolutional neural network trained on FaceForensics++ C23 face-crops. Best balanced accuracy achieved at threshold 0.725."
        ),
        ModelMetadata(
            id="vit",
            name="Vision Transformer (ViT-B/16)",
            architecture="ViT-B/16 (TorchVision)",
            status="VERIFIED_CHECKPOINT" if registry.is_loaded("vit") else "UNAVAILABLE",
            checkpoint_available=registry.is_loaded("vit"),
            checkpoint_path=str(VIT_CHECKPOINT_PATH) if VIT_CHECKPOINT_PATH else None,
            default_threshold=DEFAULT_THRESHOLDS.get("vit", 0.65),
            description="Self-attention patch transformer (16x16 patches) capturing global spatial relationships and long-range forensic discrepancies on FaceForensics++ C23."
        )
    ]
    return {
        "active_model": registry.active_model_id,
        "available_models": models_metadata
    }

@router.post("/select", response_model=SelectModelResponse)
def select_model(payload: SelectModelRequest):
    success = registry.set_active_model(payload.model_id)
    if not success:
        raise HTTPException(
            status_code=400,
            detail=f"Model '{payload.model_id}' cannot be activated. Available models: {list(registry.models.keys())}"
        )
    return {
        "status": "success",
        "active_model": registry.active_model_id,
        "message": f"Active model set to '{registry.active_model_id}'."
    }
