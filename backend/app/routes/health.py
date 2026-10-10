from fastapi import APIRouter
from app.models.model_loader import registry
from app.schemas import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def get_health():
    loaded_models = list(registry.models.keys())
    return {
        "status": "healthy" if len(loaded_models) > 0 else "degraded",
        "checkpoint_loaded": len(loaded_models) > 0,
        "loaded_models": loaded_models,
        "device": str(registry.device),
        "active_model": registry.active_model_id
    }
