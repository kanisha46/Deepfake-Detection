import csv
from pathlib import Path
from fastapi import APIRouter
from app.config import EXPERIMENTS_DIR
from app.schemas import ExperimentsListResponse

router = APIRouter(prefix="/experiments", tags=["Experiments"])

def _read_csv(filepath: Path):
    if not filepath.exists():
        return []
    with open(filepath, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)

def _read_matrix(filepath: Path):
    if not filepath.exists():
        return None
    matrix = []
    with open(filepath, mode="r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader, None)
        for row in reader:
            if row:
                matrix.append([int(float(row[1])), int(float(row[2]))])
    return matrix

@router.get("", response_model=ExperimentsListResponse)
def get_experiments():
    eff_history = _read_csv(EXPERIMENTS_DIR / "efficientnet_b0_training_history.csv")
    vit_history = _read_csv(EXPERIMENTS_DIR / "vit_training_history.csv")
    
    eff_cm_050 = _read_matrix(EXPERIMENTS_DIR / "efficientnet_b0_confusion_matrix.csv")
    eff_cm_0725 = _read_matrix(EXPERIMENTS_DIR / "efficientnet_b0_threshold_0725_confusion_matrix.csv")
    vit_cm_065 = _read_matrix(EXPERIMENTS_DIR / "vit_test_confusion_matrix.csv")

    experiments = [
        {
            "id": "exp_effnet_050",
            "title": "EfficientNet-B0 Baseline (Standard Threshold 0.50)",
            "model": "EfficientNet-B0",
            "architecture": "CNN (TorchVision EfficientNet-B0)",
            "dataset": "FaceForensics++ C23",
            "training_split": "9,800 images (1,400 Real, 8,400 Fake)",
            "validation_split": "2,100 images (300 Real, 1,800 Fake)",
            "test_split": "2,100 images (300 Real, 1,800 Fake)",
            "threshold": 0.50,
            "accuracy": 0.8429,
            "balanced_accuracy": 0.8111,
            "roc_auc": 0.8949,
            "macro_f1": 0.7428,
            "real_recall": 0.7667,  # 230/300
            "fake_recall": 0.8556,  # 1540/1800
            "confusion_matrix": eff_cm_050 or [[230, 70], [260, 1540]],
            "training_history": eff_history,
            "notes": "Standard cross-entropy threshold on class-imbalanced FaceForensics++ C23 test split."
        },
        {
            "id": "exp_effnet_0725",
            "title": "EfficientNet-B0 Calibrated (Threshold 0.725 for Imbalance Compensation)",
            "model": "EfficientNet-B0",
            "architecture": "CNN (TorchVision EfficientNet-B0)",
            "dataset": "FaceForensics++ C23",
            "training_split": "9,800 images (1,400 Real, 8,400 Fake)",
            "validation_split": "2,100 images (300 Real, 1,800 Fake)",
            "test_split": "2,100 images (300 Real, 1,800 Fake)",
            "threshold": 0.725,
            "accuracy": 0.7990,
            "balanced_accuracy": 0.7994,
            "roc_auc": 0.8949,
            "macro_f1": 0.7021,
            "real_recall": 0.8000,  # 240/300
            "fake_recall": 0.7989,  # 1438/1800
            "confusion_matrix": eff_cm_0725 or [[240, 60], [362, 1438]],
            "training_history": eff_history,
            "notes": "Higher decision threshold (0.725) counteracts the 1:6 Real:Fake class imbalance, improving Real recall from 76.7% to 80.0%."
        },
        {
            "id": "exp_vit_065",
            "title": "Vision Transformer ViT-B/16 (Tuned Threshold 0.65)",
            "model": "Vision Transformer (ViT-B/16)",
            "architecture": "Patch Self-Attention Transformer (ViT-B/16)",
            "dataset": "FaceForensics++ C23",
            "training_split": "9,800 images (1,400 Real, 8,400 Fake)",
            "validation_split": "2,100 images (300 Real, 1,800 Fake)",
            "test_split": "2,100 images (300 Real, 1,800 Fake)",
            "threshold": 0.65,
            "accuracy": 0.8781,
            "balanced_accuracy": 0.7997,
            "roc_auc": 0.9128,
            "macro_f1": 0.7727,
            "real_recall": 0.6900,  # 207/300
            "fake_recall": 0.9094,  # 1637/1800
            "confusion_matrix": vit_cm_065 or [[207, 93], [163, 1637]],
            "training_history": vit_history,
            "notes": "Higher ROC-AUC (0.9128 vs 0.8949) demonstrating superior global artifact discrimination through multi-head self-attention."
        }
    ]

    return {
        "total_experiments": len(experiments),
        "baseline_dataset": "FaceForensics++ C23",
        "experiments": experiments
    }
