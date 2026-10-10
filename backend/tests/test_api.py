import io
from PIL import Image
from fastapi.testclient import TestClient

import sys
from pathlib import Path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app
from app.models.model_loader import registry

client = TestClient(app)

def create_test_image_bytes(format="JPEG", size=(224, 224), color=(120, 150, 180)):
    img = Image.new("RGB", size, color=color)
    buf = io.BytesIO()
    img.save(buf, format=format)
    buf.seek(0)
    return buf.getvalue()

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "loaded_models" in data
    assert "device" in data
    assert "active_model" in data
    assert "checkpoint_loaded" in data

def test_models_endpoint():
    response = client.get("/models")
    assert response.status_code == 200
    data = response.json()
    assert "active_model" in data
    assert "available_models" in data
    assert len(data["available_models"]) >= 2
    model_ids = [m["id"] for m in data["available_models"]]
    assert "efficientnet_b0" in model_ids
    assert "vit" in model_ids

def test_model_select_valid():
    response = client.post("/models/select", json={"model_id": "efficientnet_b0"})
    assert response.status_code == 200
    assert response.json()["active_model"] == "efficientnet_b0"

def test_model_select_invalid():
    response = client.post("/models/select", json={"model_id": "non_existent_model_123"})
    assert response.status_code == 400
    assert "cannot be activated" in response.json()["detail"]

def test_experiments_endpoint():
    response = client.get("/experiments")
    assert response.status_code == 200
    data = response.json()
    assert data["total_experiments"] >= 2
    assert "baseline_dataset" in data
    assert len(data["experiments"]) >= 2

def test_predict_efficientnet_valid_image():
    img_bytes = create_test_image_bytes()
    files = {"file": ("test_sample.jpg", img_bytes, "image/jpeg")}
    data = {"model": "efficientnet_b0"}
    response = client.post("/predict", files=files, data=data)
    
    assert response.status_code == 200
    res = response.json()
    assert res["prediction"] in ["REAL", "FAKE", "INCONCLUSIVE"]
    assert 0.0 <= res["confidence_score"] <= 1.0
    assert 0.0 <= res["confidence"] <= 100.0
    assert "probabilities" in res
    assert "real" in res["probabilities"]
    assert "ai_generated" in res["probabilities"]
    assert res["model"] == "EfficientNet-B0"
    assert res["inference_time_ms"] > 0
    assert "message" in res

def test_predict_vit_valid_image():
    if "vit" in registry.models:
        img_bytes = create_test_image_bytes(color=(200, 100, 50))
        files = {"file": ("test_vit.png", img_bytes, "image/png")}
        data = {"model": "vit"}
        response = client.post("/predict", files=files, data=data)
        
        assert response.status_code == 200
        res = response.json()
        assert res["prediction"] in ["REAL", "FAKE", "INCONCLUSIVE"]
        assert res["model_id"] == "vit"
        assert res["threshold"] == 0.65

def test_predict_gradcam_efficientnet():
    img_bytes = create_test_image_bytes()
    files = {"file": ("test_gradcam.jpg", img_bytes, "image/jpeg")}
    data = {"model": "efficientnet_b0"}
    response = client.post("/predict/gradcam", files=files, data=data)
    
    assert response.status_code == 200
    res = response.json()
    assert res["gradcam_image_base64"] is not None
    assert res["gradcam_image_base64"].startswith("data:image/jpeg;base64,")

def test_predict_invalid_extension():
    files = {"file": ("document.pdf", b"%PDF-1.5 fake pdf content", "application/pdf")}
    response = client.post("/predict", files=files)
    assert response.status_code == 400
    assert "Invalid file extension" in response.json()["detail"]

def test_predict_corrupted_image():
    files = {"file": ("corrupt.jpg", b"not a real image at all", "image/jpeg")}
    response = client.post("/predict", files=files)
    assert response.status_code == 400
    assert "corrupted" in response.json()["detail"] or "not a valid" in response.json()["detail"]

def test_predict_empty_file():
    files = {"file": ("empty.jpg", b"", "image/jpeg")}
    response = client.post("/predict", files=files)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"]

def test_predict_oversized_file():
    # Simulate oversized file by exceeding MAX_UPLOAD_SIZE_BYTES
    large_payload = b"0" * (16 * 1024 * 1024)
    files = {"file": ("large.jpg", large_payload, "image/jpeg")}
    response = client.post("/predict", files=files)
    assert response.status_code == 413
    assert "exceeds the maximum allowed size" in response.json()["detail"]

if __name__ == "__main__":
    all_tests = [
        test_health_endpoint,
        test_models_endpoint,
        test_model_select_valid,
        test_model_select_invalid,
        test_experiments_endpoint,
        test_predict_efficientnet_valid_image,
        test_predict_vit_valid_image,
        test_predict_gradcam_efficientnet,
        test_predict_invalid_extension,
        test_predict_corrupted_image,
        test_predict_empty_file,
        test_predict_oversized_file
    ]
    for test_fn in all_tests:
        test_fn()
        print(f"PASS: {test_fn.__name__}")
    print("\nALL 12 TESTS PASSED SUCCESSFULLY!")
