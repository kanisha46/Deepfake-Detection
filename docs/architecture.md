# AI-Powered Deepfake Detection System — Architecture & Engineering Specification

## 1. System Overview

This system provides a research-grade, end-to-end framework for detecting manipulated and synthetic facial media. It integrates two distinct computer vision paradigms:
1. **Convolutional Neural Networks (CNNs)** via **EfficientNet-B0**: Capturing localized high-frequency spatial discrepancies, blending artifacts, and boundary resampling cues.
2. **Vision Transformers (ViTs)** via **ViT-B/16**: Capturing global self-attention across image patch tokens to detect long-range structural, geometric, and lighting inconsistencies.

---

## 2. Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  USER / CLIENT                                    |
|                       (React 19 + Vite 8 Responsive GUI)                          |
+-----------------------------------------------------------------------------------+
                                    │
                         HTTP POST /predict [multipart/form-data]
                                    │
                                    v
+-----------------------------------------------------------------------------------+
|                                FASTAPI BACKEND                                    |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Request Validation Layer                                                    |  |
|  | - File Extension (.jpg, .jpeg, .png, .webp)                                 |  |
|  | - Content-Type MIME Verification                                            |  |
|  | - Size Guard (<= 15MB)                                                      |  |
|  +-----------------------------------------------------------------------------+  |
|                                    │                                              |
|                                    v                                              |
|  +-----------------------------------------------------------------------------+  |
|  | Preprocessing & Normalization                                               |  |
|  | - PIL sanitized RGB decoding (EXIF auto-transposition)                      |  |
|  | - Face Crop Detection / Bilinear Resizing to 224x224                        |  |
|  | - PyTorch ImageNet Tensor Normalization (mean=[0.485, 0.456, 0.406],        |  |
|  |                                          std=[0.229, 0.224, 0.225])         |  |
|  +-----------------------------------------------------------------------------+  |
|                                    │                                              |
|                   ┌────────────────┴────────────────┐                             |
|                   v                                 v                             |
|  +---------------------------------+  +---------------------------------+         |
|  | EfficientNet-B0 (CNN)           |  | Vision Transformer (ViT-B/16)   |         |
|  | - 5.3M parameters               |  | - 86M parameters                |         |
|  | - Inverted Residual Bottlenecks |  | - 16x16 Patch Embeddings        |         |
|  | - Squeeze-and-Excitation        |  | - 12 Multi-Head Attention Blocks|         |
|  | - Linear(1280 -> 2) Head        |  | - Linear(768 -> 2) Head         |         |
|  +---------------------------------+  +---------------------------------+         |
|                   │                                 │                             |
|                   └────────────────┬────────────────┘                             |
|                                    v                                              |
|  +-----------------------------------------------------------------------------+  |
|  | Calibrated Decision & Uncertainty Policy                                    |  |
|  | - Softmax Probabilities: P(Real) + P(Fake) = 1.0                           |  |
|  | - Model Thresholds: EfficientNet-B0 (0.50 / 0.725), ViT (0.65)             |  |
|  | - Inconclusive Margin: Flag if |P(Fake) - Threshold| < 0.05                 |  |
|  | - Final Verdict: REAL, FAKE, or INCONCLUSIVE                                |  |
|  +-----------------------------------------------------------------------------+  |
|                                    │                                              |
|                                    v                                              |
|  +-----------------------------------------------------------------------------+  |
|  | Model Explainability Engine                                                 |  |
|  | - EfficientNet-B0: Gradient-weighted Class Activation Mapping (Grad-CAM)    |  |
|  |   on target features.8 layer with Jet colormap overlay                      |  |
|  | - ViT: Transparent limitation note (patch attention vs conv activations)    |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                    │
                         JSON Response + Grad-CAM Base64
                                    │
                                    v
+-----------------------------------------------------------------------------------+
|                                  USER / CLIENT                                    |
|  - Verdict Banner (REAL / FAKE / INCONCLUSIVE)                                    |
|  - Confidence Score % & Latency in ms                                             |
|  - Probability Breakdown Bars                                                     |
|  - Explainability Heatmap & Forensic Context                                      |
+-----------------------------------------------------------------------------------+
```

---

## 3. Dataset & Empirical Results Summary

### FaceForensics++ C23 Prepared Benchmark
- **Training Set:** 9,800 images (1,400 Real, 8,400 Fake) — 1:6 ratio
- **Validation Set:** 2,100 images (300 Real, 1,800 Fake)
- **Test Set:** 2,100 images (300 Real, 1,800 Fake)

### Comparative Performance Table

| Model Architecture | Threshold | Accuracy | Balanced Accuracy | ROC-AUC | Macro F1 | Real Recall (TN/(TN+FP)) | Fake Recall (TP/(FN+TP)) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **EfficientNet-B0** | `0.500` | 84.29% | 81.11% | 0.8949 | 0.7428 | 76.67% | 85.56% |
| **EfficientNet-B0 (Tuned)** | `0.725` | 79.90% | 79.94% | 0.8949 | 0.7021 | 80.00% | 79.89% |
| **ViT-B/16** | `0.650` | **87.81%** | **79.97%** | **0.9128** | **0.7727** | 69.00% | **90.94%** |

### Confusion Matrices on Held-out Test Set (N = 2,100)

#### EfficientNet-B0 (Threshold 0.50):
```
                 Predicted REAL    Predicted FAKE
Actual REAL           230               70
Actual FAKE           260             1540
```

#### EfficientNet-B0 (Threshold 0.725):
```
                 Predicted REAL    Predicted FAKE
Actual REAL           240               60
Actual FAKE           362             1438
```

#### Vision Transformer (ViT-B/16, Threshold 0.65):
```
                 Predicted REAL    Predicted FAKE
Actual REAL           207               93
Actual FAKE           163             1637
```

---

## 4. Key Engineering & Research Decisions

### 1. Zero Data Leakage Enforcement
- No frames or crops from the same source video or subject identity appear across more than one split.
- The test partition (2,100 images) was kept strictly untouched during training and parameter optimization.

### 2. Class Imbalance Mitigation
- Training distribution features a 1:6 imbalance (85.7% Fake images).
- Unweighted accuracy (84.29%) artificially reflects the dominant Fake class.
- The application reports **Balanced Accuracy** as the primary diagnostic metric and incorporates threshold calibration (0.725) to increase Real class recall from 76.67% to 80.00%.

### 3. Calibrated Uncertainty Margin
- An uncertainty margin of $\pm 0.05$ around the decision threshold classifies border predictions as `INCONCLUSIVE`.
- Softmax outputs are treated as non-calibrated pseudo-probabilities rather than absolute guarantees of authenticity.

### 4. Explainable AI (Grad-CAM)
- Grad-CAM attaches forward and backward hooks to the final convolutional block of EfficientNet-B0 (`features.8`).
- Explanations are explicitly labeled as model attention visualizers, avoiding claims of definitive proof of manipulation.
