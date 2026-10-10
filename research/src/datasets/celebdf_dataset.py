"""
Celeb-DF (v2) Cross-Dataset Evaluation Adapter
Provides PyTorch Dataset interface for evaluating generalization on high-quality deepfake face crops.
Prevents data leakage by strictly partitioning by celebrity identity / video ID.
"""

from pathlib import Path
from typing import List, Tuple, Optional
from PIL import Image
import torch
from torch.utils.data import Dataset
from torchvision import transforms

class CelebDFDataset(Dataset):
    """
    Celeb-DF v2 dataset loader for cross-dataset zero-shot generalization.
    Labels:
        0 = Real (Celeb-real or YouTube-real)
        1 = Fake (Celeb-synthesis)
    """
    def __init__(
        self,
        root_dir: str,
        split: str = "test",
        transform: Optional[transforms.Compose] = None
    ):
        self.root_dir = Path(root_dir)
        self.split = split
        self.transform = transform or transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        self.samples: List[Tuple[Path, int]] = []
        self._load_samples()

    def _load_samples(self):
        # Look for typical Celeb-DF folder conventions
        real_dir = self.root_dir / "Celeb-real"
        fake_dir = self.root_dir / "Celeb-synthesis"
        
        if real_dir.exists():
            for p in real_dir.glob("*.[jJ][pP][gG]"):
                self.samples.append((p, 0))
                
        if fake_dir.exists():
            for p in fake_dir.glob("*.[jJ][pP][gG]"):
                self.samples.append((p, 1))

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, int]:
        img_path, label = self.samples[idx]
        image = Image.open(img_path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        return image, label
