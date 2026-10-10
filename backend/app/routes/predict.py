import logging
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from PIL import Image, UnidentifiedImageError

from app.schemas import PredictionResponse
from app.services.predictor import run_prediction
from app.services.preprocessor import decode_image_bytes
from app.config import (
    MAX_UPLOAD_SIZE_BYTES,
    ALLOWED_EXTENSIONS,
    ALLOWED_MIME_TYPES
)

logger = logging.getLogger("deepfake_backend.predict_route")
router = APIRouter(tags=["Prediction"])

async def _process_and_predict(
    file: UploadFile,
    model_id: Optional[str] = None,
    threshold: Optional[float] = None,
    generate_gradcam: bool = False
) -> PredictionResponse:
    # 1. Validate file extension
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file extension '{ext}'. Supported formats: {sorted(list(ALLOWED_EXTENSIONS))}"
        )

    # 2. Validate MIME type
    if file.content_type and file.content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid content type '{file.content_type}'. Supported image MIME types: {ALLOWED_MIME_TYPES}"
        )

    # 3. Read and check size
    try:
        content = await file.read()
    except Exception as e:
        logger.error(f"Failed to read uploaded file: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not read uploaded file content."
        )

    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes)."
        )

    if len(content) > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Uploaded file exceeds the maximum allowed size of {MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)} MB."
        )

    # 4. Decode image
    try:
        image = decode_image_bytes(content)
    except UnidentifiedImageError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is not a valid or supported image format, or the image data is corrupted."
        )
    except Exception as e:
        logger.error(f"Image decoding error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to decode image data."
        )

    # 5. Run prediction
    try:
        result = run_prediction(
            image=image,
            model_id=model_id,
            generate_gradcam=generate_gradcam,
            custom_threshold=threshold
        )
        return PredictionResponse(**result)
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Inference error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during deep learning model inference."
        )

@router.post("/predict", response_model=PredictionResponse)
async def predict_image(
    file: UploadFile = File(...),
    model: Optional[str] = Form(None),
    threshold: Optional[float] = Form(None)
):
    """
    Classifies an uploaded image as REAL, FAKE, or INCONCLUSIVE using the selected model.
    """
    return await _process_and_predict(
        file=file,
        model_id=model,
        threshold=threshold,
        generate_gradcam=False
    )

@router.post("/predict/gradcam", response_model=PredictionResponse)
async def predict_image_gradcam(
    file: UploadFile = File(...),
    model: Optional[str] = Form(None),
    threshold: Optional[float] = Form(None)
):
    """
    Classifies an uploaded image and computes Grad-CAM saliency heatmaps for explainability (EfficientNet-B0).
    """
    return await _process_and_predict(
        file=file,
        model_id=model,
        threshold=threshold,
        generate_gradcam=True
    )
