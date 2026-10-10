import io
import cv2
import numpy as np
import torch
from PIL import Image, ImageOps
from torchvision import transforms
from typing import Tuple, Optional

# FaceForensics++ / PyTorch ImageNet standards
IMAGE_SIZE = (224, 224)
NORM_MEAN = [0.485, 0.456, 0.406]
NORM_STD = [0.229, 0.224, 0.225]

inference_transforms = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(mean=NORM_MEAN, std=NORM_STD)
])

# Load OpenCV face detector if available
face_cascade = None
try:
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(cascade_path)
except Exception:
    face_cascade = None

def decode_image_bytes(image_bytes: bytes) -> Image.Image:
    """Decodes raw bytes into a sanitized RGB PIL Image handling EXIF rotation."""
    image = Image.open(io.BytesIO(image_bytes))
    image = ImageOps.exif_transpose(image)
    if image.mode != "RGB":
        image = image.convert("RGB")
    return image

def extract_face_or_crop(pil_img: Image.Image, margin: float = 0.2) -> Tuple[Image.Image, bool]:
    """
    If a clear human face is detected in a large frame, crop it with context margin.
    If already a face crop or no face detected, return original image.
    """
    if face_cascade is None:
        return pil_img, False
    
    np_img = np.array(pil_img)
    gray = cv2.cvtColor(np_img, cv2.COLOR_RGB2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
    
    if len(faces) == 0:
        return pil_img, False
    
    # Pick largest detected face
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    
    # Apply margin
    dw = int(w * margin)
    dh = int(h * margin)
    x1 = max(0, x - dw)
    y1 = max(0, y - dh)
    x2 = min(pil_img.width, x + w + dw)
    y2 = min(pil_img.height, y + h + dh)
    
    cropped = pil_img.crop((x1, y1, x2, y2))
    return cropped, True

def preprocess_image(pil_img: Image.Image, auto_face_crop: bool = False) -> Tuple[torch.Tensor, Image.Image]:
    """
    Prepares a PIL image for model inference.
    Returns:
        tensor: Normalized tensor of shape (1, 3, 224, 224)
        processed_pil: The PIL image after potential face cropping and resizing
    """
    if auto_face_crop:
        pil_img, _ = extract_face_or_crop(pil_img)
    
    resized_pil = pil_img.resize(IMAGE_SIZE, Image.Resampling.BILINEAR)
    tensor = inference_transforms(pil_img).unsqueeze(0)
    return tensor, resized_pil
