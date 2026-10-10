"""
Model architecture builders for research experiments.
Supports EfficientNet-B0 and Vision Transformer (ViT-B/16).
"""

from torchvision.models import efficientnet_b0, vit_b_16
import torch.nn as nn

def get_efficientnet_b0(num_classes: int = 2, pretrained: bool = False) -> nn.Module:
    weights = "DEFAULT" if pretrained else None
    model = efficientnet_b0(weights=weights)
    if num_classes != 1000:
        model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)
    return model

def get_vit_b_16(num_classes: int = 2, pretrained: bool = False) -> nn.Module:
    weights = "DEFAULT" if pretrained else None
    model = vit_b_16(weights=weights)
    if num_classes != 1000:
        model.heads.head = nn.Linear(model.heads.head.in_features, num_classes)
    return model

__all__ = ["get_efficientnet_b0", "get_vit_b_16"]
