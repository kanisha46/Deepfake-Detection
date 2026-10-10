from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any

class HealthResponse(BaseModel):
    status: str
    checkpoint_loaded: bool
    loaded_models: List[str]
    device: str
    active_model: str

class ModelMetadata(BaseModel):
    id: str
    name: str
    architecture: str
    status: str
    checkpoint_available: bool
    checkpoint_path: Optional[str] = None
    default_threshold: float
    description: str

class ModelsListResponse(BaseModel):
    active_model: str
    available_models: List[ModelMetadata]

class SelectModelRequest(BaseModel):
    model_id: str

class SelectModelResponse(BaseModel):
    status: str
    active_model: str
    message: str

class PredictionProbabilities(BaseModel):
    real: float
    ai_generated: float

class PredictionResponse(BaseModel):
    prediction: str  # 'REAL', 'FAKE', or 'INCONCLUSIVE'
    confidence: float  # Percentage (e.g. 94.2) or fraction
    confidence_score: float  # Decimal (0.0 to 1.0)
    probabilities: PredictionProbabilities
    model: str
    model_id: str
    threshold: float
    inference_time_ms: float
    message: str
    explanation: Optional[str] = None
    model_status: str = "PRODUCTION_CHECKPOINT"
    gradcam_image_base64: Optional[str] = None
    is_inconclusive: bool = False

class ExperimentRecord(BaseModel):
    id: str
    title: str
    model: str
    threshold: float
    dataset: str
    test_images: int
    accuracy: float
    balanced_accuracy: float
    roc_auc: float
    macro_f1: float
    confusion_matrix: Optional[List[List[int]]] = None
    history: Optional[List[Dict[str, Any]]] = None

class ExperimentsListResponse(BaseModel):
    total_experiments: int
    baseline_dataset: str
    experiments: List[Dict[str, Any]]
