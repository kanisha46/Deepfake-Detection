from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent

# Checkpoint paths (check experiments/ first, then backend/checkpoints/)
EXPERIMENTS_DIR = PROJECT_ROOT / "experiments"
CHECKPOINTS_DIR = BASE_DIR / "checkpoints"

CHECKPOINTS_DIR.mkdir(parents=True, exist_ok=True)

EFFNET_CHECKPOINT_CANDIDATES = [
    EXPERIMENTS_DIR / "efficientnet_b0_best.pth",
    CHECKPOINTS_DIR / "efficientnet_b0_best.pth",
    CHECKPOINTS_DIR / "best_model.pth"
]

VIT_CHECKPOINT_CANDIDATES = [
    EXPERIMENTS_DIR / "vit_face_best.pth",
    CHECKPOINTS_DIR / "vit_face_best.pth"
]

def find_checkpoint(candidates):
    for candidate in candidates:
        if candidate.exists() and candidate.is_file():
            return candidate
    return None

EFFNET_CHECKPOINT_PATH = find_checkpoint(EFFNET_CHECKPOINT_CANDIDATES)
VIT_CHECKPOINT_PATH = find_checkpoint(VIT_CHECKPOINT_CANDIDATES)

# Threshold settings
# Based on experimental optimization on FaceForensics++ C23 test split
DEFAULT_THRESHOLDS = {
    "efficientnet_b0": 0.50,
    "efficientnet_b0_tuned": 0.725,
    "vit": 0.65
}

# Uncertainty margin: if |prob_fake - threshold| < MARGIN, mark INCONCLUSIVE
INCONCLUSIVE_MARGIN = 0.05

# Upload restrictions
MAX_UPLOAD_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB
ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# Device configuration
DEVICE = os.getenv("DEVICE", "cpu")
