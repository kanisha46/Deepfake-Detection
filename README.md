# AI-Powered Deepfake Detection Using CNN and Vision Transformer Architectures for Cross-Dataset Generalization

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite_8-646CFF.svg)](https://vitejs.dev)
[![PyTorch](https://img.shields.io/badge/Deep_Learning-PyTorch-EE4C2C.svg)](https://pytorch.org)
[![Code_Style](https://img.shields.io/badge/Lint-Oxlint_0_Warnings-success.svg)](https://oxc-project.github.io)

An academic, research-grade computer vision system evaluating and enhancing cross-dataset and cross-generator generalization in AI-manipulated and deepfake media detection.

---

## 📌 Research Team
- **Priyanka Ganjawala** (Student ID: IT035)
- **Kanisha Jasoliya** (Student ID: IT047)
- *Department of Information Technology, Dharmsinh Desai University, Nadiad, Gujarat, India*

---

## 🎯 Research Objective & Problem Statement

Deep learning models trained to detect manipulated facial imagery frequently achieve high intra-distribution accuracy (>90%) on specific training distributions, yet suffer sharp performance degradation when evaluated on unseen generators (such as modern diffusion or synthesis pipelines), varied video compression standards, or distinct facial demographics.

**Primary Objectives:**
1. Train, calibrate, and compare convolutional neural networks (**EfficientNet-B0**) against patch self-attention vision transformers (**ViT-B/16**) on standardized face crops.
2. Directly confront real-world **class imbalance** (1:6 Real-to-Fake ratio) using balanced accuracy, threshold calibration, and decision policies.
3. Enforce a rigorous **zero-leakage evaluation protocol** preventing identity and video-source cross-contamination.
4. Provide explainability via **Grad-CAM** for CNN feature backbones and provide transparent calibration policies with an **INCONCLUSIVE** margin near decision boundaries.
5. Provide a production-grade **FastAPI** backend and responsive **React 19** frontend for real-time inference and empirical research exploration.

---

## 🔬 Baseline Experimental Results (FaceForensics++ C23)

All reported figures reflect empirical experiments on the prepared **FaceForensics++ C23** face-crop dataset:
- **Training Set:** 9,800 images (1,400 Real, 8,400 Fake)
- **Validation Set:** 2,100 images (300 Real, 1,800 Fake)
- **Test Set:** 2,100 images (300 Real, 1,800 Fake)
- **Class Labels:** `REAL = 0`, `FAKE = 1`

### Comparative Benchmark Table

| Model Architecture | Threshold | Accuracy | Balanced Accuracy | ROC-AUC | Macro F1 | Real Recall (Class 0) | Fake Recall (Class 1) | Specificity |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **EfficientNet-B0** | `0.500` | 84.29% | 81.11% | 0.8949 | 0.7428 | 76.67% | 85.56% | 76.67% |
| **EfficientNet-B0 (Tuned)** | `0.725` | 79.90% | 79.94% | 0.8949 | 0.7021 | 80.00% | 79.89% | 80.00% |
| **Vision Transformer (ViT-B/16)** | `0.650` | **87.81%** | **79.97%** | **0.9128** | **0.7727** | 69.00% | **90.94%** | 69.00% |

### Confusion Matrices on Held-out Test Set (N = 2,100)

#### EfficientNet-B0 (Threshold 0.50)
```
                 Predicted REAL    Predicted FAKE
Actual REAL           230               70
Actual FAKE           260             1540
```

#### EfficientNet-B0 (Threshold 0.725 — Imbalance Tuned)
```
                 Predicted REAL    Predicted FAKE
Actual REAL           240               60
Actual FAKE           362             1438
```

#### Vision Transformer (ViT-B/16, Threshold 0.65)
```
                 Predicted REAL    Predicted FAKE
Actual REAL           207               93
Actual FAKE           163             1637
```

> **Why Balanced Accuracy & ROC-AUC Matter:**  
> In a 1:6 imbalanced dataset (85.7% Fake), a naive model predicting exclusively "Fake" achieves 85.7% raw accuracy with zero authentic face discrimination. Hence, unweighted accuracy can be misleading. **ROC-AUC (0.9128 for ViT vs 0.8949 for EffNet)** and **Balanced Accuracy** reflect true discriminative capability.

---

## 🏛️ System Architecture

```
+─────────────────────────────────────────────────────────────+
│                       React 19 Client                       │
│  - Image Upload & Preview    - Model Selector (EffNet / ViT)│
│  - Grad-CAM Heatmap Viewer   - Live Decision Verdicts       │
+─────────────────────────────────────────────────────────────+
                              │
                    POST /predict, POST /predict/gradcam
                              ▼
+─────────────────────────────────────────────────────────────+
│                    FastAPI Inference Engine                 │
│  - Request validation & size checks                         │
│  - Deterministic 224x224 RGB ImageNet normalization         │
│  - PyTorch inference on CPU / GPU                           │
│  - Decision policy: REAL, FAKE, or INCONCLUSIVE             │
│  - Grad-CAM activation mapping (EfficientNet-B0)            │
+─────────────────────────────────────────────────────────────+
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
+───────────────────────────+   +───────────────────────────+
│ EfficientNet-B0 (CNN)     │   │ Vision Transformer (ViT)  │
│ 5.3M parameters           │   │ 86M parameters            │
│ Local blending artifacts  │   │ Global patch attention    │
│ experiments/              │   │ experiments/              │
│ efficientnet_b0_best.pth  │   │ vit_face_best.pth         │
+───────────────────────────+   +───────────────────────────+
```

---

## 📂 Repository Structure

```
deepfake-detection/
├── backend/
│   ├── app/
│   │   ├── config.py                 # Thresholds, paths, limits
│   │   ├── schemas.py                # Pydantic schemas
│   │   ├── models/
│   │   │   └── model_loader.py       # Strict loader with validation & warmup
│   │   ├── services/
│   │   │   ├── preprocessor.py       # Deterministic image preprocessing
│   │   │   ├── predictor.py          # Calibrated inference & decision logic
│   │   │   └── gradcam.py            # Grad-CAM overlay generation
│   │   └── routes/
│   │       ├── health.py             # GET /health
│   │       ├── models.py             # GET /models, POST /models/select
│   │       ├── predict.py            # POST /predict, POST /predict/gradcam
│   │       └── experiments.py        # GET /experiments
│   ├── checkpoints/                  # Trained weights placement
│   ├── tests/
│   │   └── test_api.py               # Automated pytest/unittest suite
│   ├── main.py                       # Uvicorn entrypoint
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, ImageUpload, PredictionResult, GradCAM
│   │   ├── pages/                    # Home, Detection, Results, Experiments, Research, About
│   │   └── services/api.js           # Axios API client
│   ├── package.json
│   └── vite.config.js
│
├── experiments/                      # Historical verified training artifacts
│   ├── efficientnet_b0_best.pth      # 16.3 MB verified checkpoint
│   ├── vit_face_best.pth             # 343.2 MB verified checkpoint
│   ├── efficientnet_b0_confusion_matrix.csv
│   ├── efficientnet_b0_test_results.csv
│   ├── efficientnet_b0_training_history.csv
│   ├── vit_final_test_results.csv
│   ├── vit_test_confusion_matrix.csv
│   └── vit_training_history.csv
│
├── research/
│   ├── evaluate.py                   # Metric computation & ECE calibration
│   └── src/
│       ├── models/__init__.py        # Architecture constructors
│       ├── datasets/celebdf_dataset.py # Celeb-DF v2 adapter
│       └── cross_dataset.py          # Generalization evaluation harness
│
├── docs/
│   └── architecture.md               # Detailed technical specification
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Move to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start backend server
python main.py
```
Backend will start on **`http://localhost:8000`**.  
Interactive Swagger documentation: **`http://localhost:8000/docs`**.

### 3. Frontend Setup
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install npm packages
npm install

# Start Vite dev server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Automated Testing

### Backend Tests (12 Test Cases)
```bash
python backend/tests/test_api.py
```
Tests:
- `/health` endpoint and device status
- `/models` registry and model switching
- Valid predictions with EfficientNet-B0 and ViT-B/16
- Grad-CAM heatmap generation
- Error handling for invalid file extensions, corrupted images, empty files, and oversized uploads (>15MB)

### Frontend Build & Lint Verification
```bash
cd frontend
npm run lint    # Oxlint (0 errors, 0 warnings)
npm run build   # Vite production bundle verification
```

### Research Metric Reproduction
```bash
python research/evaluate.py
```
Reproduces the recorded test confusion matrices, balanced accuracy, specificity, and Expected Calibration Error (ECE).

---

## ⚖️ Scientific Integrity & Disclaimers

1. **Honest Performance Targets:** Detection systems must never guarantee 99.99% accuracy across open-world settings. Forensic models are sensitive to unseen generators, JPEG recompression, downscaling, and adversarial perturbations.
2. **Probability Calibration:** Raw softmax probabilities do not equal posterior Bayesian probabilities of authenticity. Predictions near the decision threshold ($\pm 0.05$) are reported as `INCONCLUSIVE`.
3. **Zero Data Leakage:** Video identities are partitioned strictly to avoid frame correlation shortcuts.
4. **Grad-CAM Role:** Heatmaps are qualitative explanatory visual aids, not proof of forgery.

---

## 📜 References

1. Tan, M., & Le, Q. (2019). *EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks*. ICML.
2. Dosovitskiy, A., et al. (2020). *An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale*. ICLR.
3. Rössler, A., et al. (2019). *FaceForensics++: Learning to Detect Manipulated Facial Images*. ICCV.
4. Selvaraju, R. R., et al. (2017). *Grad-CAM: Visual Explanations from Deep Networks via Gradient-Based Localization*. ICCV.
5. Guo, C., et al. (2017). *On Calibration of Modern Neural Networks*. ICML.

---

## 📄 License
This project is licensed under the MIT License. See [LICENSE](file:///d:/deepfake%20detection/LICENSE) for details.
