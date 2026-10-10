# FastAPI Deepfake Detection Backend Service

Research-grade deep learning inference API supporting **EfficientNet-B0** and **Vision Transformer (ViT-B/16)** for authentic vs. manipulated media classification.

---

## 🚀 Quickstart

### 1. Requirements
Ensure Python 3.10+ is available.
```bash
cd backend
pip install -r requirements.txt
```

### 2. Verify Checkpoints
Checkpoints are located in `experiments/` or `backend/checkpoints/`:
- `efficientnet_b0_best.pth` (~16.3 MB)
- `vit_face_best.pth` (~343.2 MB)

### 3. Run Development Server
```bash
python main.py
# Or using uvicorn directly:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation (Swagger UI): **`http://localhost:8000/docs`**

---

## 📡 API Endpoints

### `GET /health`
Returns server operational health, compute device, and loaded model checkpoints.
```json
{
  "status": "healthy",
  "checkpoint_loaded": true,
  "loaded_models": ["efficientnet_b0", "vit"],
  "device": "cpu",
  "active_model": "efficientnet_b0"
}
```

### `GET /models`
Returns available architectures, metadata, and default decision thresholds.

### `POST /models/select`
Switches active default model.
```json
{ "model_id": "vit" }
```

### `POST /predict`
Uploads an image file (`image/jpeg`, `image/png`, `image/webp`) and returns prediction.
- **Form Data:**
  - `file`: Image binary data (max 15 MB)
  - `model` (optional): `"efficientnet_b0"` or `"vit"`
  - `threshold` (optional): custom float threshold

**Sample Response:**
```json
{
  "prediction": "FAKE",
  "confidence": 94.2,
  "confidence_score": 0.942,
  "probabilities": {
    "real": 0.058,
    "ai_generated": 0.942
  },
  "model": "EfficientNet-B0",
  "model_id": "efficientnet_b0",
  "threshold": 0.5,
  "inference_time_ms": 38.4,
  "message": "The model detected structural and frequency artifacts characteristic of synthetic/manipulated imagery.",
  "explanation": "Predicted FAKE with 94.2% probability. P(Fake)=0.9420 exceeds the calibrated threshold of 0.500.",
  "model_status": "PRODUCTION_CHECKPOINT",
  "is_inconclusive": false
}
```

### `POST /predict/gradcam`
Same as `/predict`, but additionally computes and attaches a `gradcam_image_base64` visual activation heatmap (for EfficientNet-B0).

### `GET /experiments`
Serves parsed FaceForensics++ C23 experimental records, confusion matrices, and training history directly from disk.

---

## 🧪 Testing

Execute automated unit and integration tests:
```bash
python tests/test_api.py
```
Validates:
- Health and model registry endpoints
- Valid image predictions across both models
- Grad-CAM heatmap generation
- Corrupted image error handling
- Invalid extension rejections
- Oversized upload guards (HTTP 413)
