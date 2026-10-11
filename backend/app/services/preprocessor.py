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
    if hasattr(cv2, 'data') and hasattr(cv2.data, 'haarcascades'):
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        if hasattr(cv2, 'CascadeClassifier'):
            face_cascade = cv2.CascadeClassifier(cascade_path)
            if face_cascade.empty():
                face_cascade = None
except Exception:
    face_cascade = None

def decode_image_bytes(image_bytes: bytes) -> Image.Image:
    """Decodes raw bytes into a sanitized RGB PIL Image handling EXIF rotation."""
    image = Image.open(io.BytesIO(image_bytes))
    image = ImageOps.exif_transpose(image)
    if image.mode != "RGB":
        image = image.convert("RGB")
    return image

def extract_face_or_crop(pil_img: Image.Image, margin: float = 0.30) -> Tuple[Image.Image, bool]:
    """
    Robust multi-stage face and portrait extractor.
    1. If OpenCV Haar cascade is functional, use it.
    2. Otherwise, use biometric skin-chrominance (YCrCb) morphological connected-component
       segmentation tuned for human facial aspect ratios and upper-half positioning.
    3. If the image is a vertical portrait / fashion shot with a distant face, apply smart portrait framing.
    4. If the image is already a close-up face crop, preserve as-is without degradation.
    """
    img_np = np.array(pil_img.convert("RGB"))
    h, w, _ = img_np.shape

    # Check if already a close-up face (e.g. from FaceForensics benchmarks)
    ycbcr = cv2.cvtColor(img_np, cv2.COLOR_RGB2YCrCb)
    cr = ycbcr[:, :, 1]
    cb = ycbcr[:, :, 2]
    skin_mask = (cr >= 133) & (cr <= 173) & (cb >= 77) & (cb <= 127)
    skin_ratio = float(np.sum(skin_mask)) / float(h * w)

    # 1. Try OpenCV cascade detector if available
    if face_cascade is not None:
        try:
            gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(40, 40))
            if len(faces) > 0:
                x, y, bw, bh = max(faces, key=lambda f: f[2] * f[3])
                # If face already fills majority of image, keep original
                if bw > 0.65 * w and bh > 0.60 * h:
                    return pil_img, False
                dw, dh = int(bw * margin), int(bh * margin)
                x1 = max(0, x - dw)
                y1 = max(0, y - dh)
                x2 = min(w, x + bw + dw)
                y2 = min(h, y + bh + dh)
                return pil_img.crop((x1, y1, x2, y2)), True
        except Exception:
            pass

    # If the image is already a close-up face shot (skin_ratio >= 0.10 and roughly square aspect)
    if skin_ratio >= 0.10 or (0.80 <= (h / w) <= 1.25 and skin_ratio >= 0.06):
        return pil_img, False

    # 2. Biometric skin-chrominance connected components for upper-body / full-body shots
    if h > 1.10 * w or skin_ratio < 0.09:
        kernel = np.ones((5, 5), np.uint8)
        clean_mask = cv2.morphologyEx(skin_mask.astype(np.uint8), cv2.MORPH_OPEN, kernel)
        clean_mask = cv2.morphologyEx(clean_mask, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))

        upper_mask = clean_mask.copy()
        upper_mask[int(0.65 * h):, :] = 0  # Faces are located in top 65% of portrait
        contours, _ = cv2.findContours(upper_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        valid_boxes = []
        for c in contours:
            bx, by, bw, bh = cv2.boundingRect(c)
            area = bw * bh
            if area > (w * h * 0.008):  # at least 0.8% of image
                aspect = bw / float(bh)
                if 0.40 <= aspect <= 2.2:
                    center_dist = abs((bx + bw / 2) - (w / 2)) / w
                    score = area * (1.0 - 0.40 * center_dist)
                    valid_boxes.append((score, (bx, by, bw, bh)))

        if valid_boxes:
            valid_boxes.sort(key=lambda item: item[0], reverse=True)
            _, (bx, by, bw, bh) = valid_boxes[0]
            dw, dh = int(bw * 0.35), int(bh * 0.35)
            x1 = max(0, bx - dw)
            y1 = max(0, by - dh)
            x2 = min(w, bx + bw + dw)
            y2 = min(h, by + bh + dh)
            if (x2 - x1) < 0.88 * w or (y2 - y1) < 0.88 * h:
                return pil_img.crop((x1, y1, x2, y2)), True

        # 3. Portrait vertical framing fallback (top 45% centered)
        if h > 1.20 * w:
            x1 = int(0.12 * w)
            y1 = int(0.01 * h)
            x2 = int(0.88 * w)
            y2 = int(0.46 * h)
            return pil_img.crop((x1, y1, x2, y2)), True

    return pil_img, False

def preprocess_image(pil_img: Image.Image, auto_face_crop: bool = False) -> Tuple[torch.Tensor, Image.Image, bool]:
    """
    Prepares a PIL image for model inference.
    Returns:
        tensor: Normalized tensor of shape (1, 3, 224, 224)
        processed_pil: The PIL image after potential face cropping and resizing
        was_cropped: Boolean flag indicating whether face cropping occurred
    """
    was_cropped = False
    target_img = pil_img
    if auto_face_crop:
        target_img, was_cropped = extract_face_or_crop(pil_img)

    resized_pil = target_img.resize(IMAGE_SIZE, Image.Resampling.BILINEAR)
    tensor = inference_transforms(target_img).unsqueeze(0)
    return tensor, resized_pil, was_cropped
