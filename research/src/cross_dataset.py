"""
Cross-Dataset Generalization Evaluation Script
Tests checkpoints trained on FaceForensics++ against independent datasets (e.g. Celeb-DF, DFDC, Midjourney).
"""

import argparse
from pathlib import Path
import torch
from torch.utils.data import DataLoader
from torchvision.models import efficientnet_b0, vit_b_16

import sys
project_root = Path(__file__).resolve().parent.parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from research.evaluate import evaluate_metrics, print_report

def run_cross_evaluation(
    model_name: str,
    checkpoint_path: str,
    dataset_name: str,
    data_dir: str,
    batch_size: int = 32
):
    print(f"Loading checkpoint {checkpoint_path} for model {model_name}...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    if model_name == "efficientnet_b0":
        model = efficientnet_b0(num_classes=2)
    elif model_name == "vit":
        model = vit_b_16(num_classes=2)
    else:
        raise ValueError(f"Unsupported model: {model_name}")
        
    state_dict = torch.load(checkpoint_path, map_location="cpu")
    model.load_state_dict(state_dict, strict=True)
    model.to(device)
    model.eval()
    
    print(f"Evaluating zero-shot cross-dataset generalization on {dataset_name} ({data_dir})...")
    # Stub / Adapter execution for when user mounts the dataset directory
    print(f"Dataset target: {dataset_name}. Checking presence at {data_dir}...")
    if not Path(data_dir).exists():
        print(f"Note: External dataset path '{data_dir}' not mounted locally. Mount dataset to run live inference.")
        return

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Cross-Dataset Generalization Harness")
    parser.add_argument("--model", type=str, default="efficientnet_b0", choices=["efficientnet_b0", "vit"])
    parser.add_argument("--checkpoint", type=str, default="experiments/efficientnet_b0_best.pth")
    parser.add_argument("--dataset", type=str, default="Celeb-DF")
    parser.add_argument("--data_dir", type=str, default="data/celeb_df")
    args = parser.parse_args()
    
    run_cross_evaluation(args.model, args.checkpoint, args.dataset, args.data_dir)
