# AI-Powered Deepfake Detection

An AI-powered image deepfake detection system that uses deep learning models to identify whether an image is real or AI-generated.

The project focuses on evaluating the generalization ability of deepfake detection models across different image-generation datasets.

---

## 📌 Project Overview

The rapid growth of generative AI models has made it increasingly difficult to distinguish AI-generated images from real images.

This project aims to develop an image-based deepfake detection system using CNN and Vision Transformer architectures and evaluate their ability to generalize to unseen AI image generators.

The system takes an image as input and predicts whether it is:

- **AI Generated**
- **Real / Natural**

The project also evaluates cross-dataset generalization by training on one dataset and testing on images generated using a different AI generator.

---

## 🎯 Objectives

- Develop an AI-based image deepfake detection system.
- Train deep learning models for real vs AI-generated image classification.
- Investigate CNN-based and Vision Transformer architectures.
- Evaluate model performance using standard classification metrics.
- Study cross-dataset and cross-generator generalization.
- Build a web-based interface for image detection.
- Deploy the trained model and application for practical use.

---

## 🧠 Proposed Architecture

The project consists of three major components:

```text
                User
                 │
                 ▼
        ┌─────────────────┐
        │ React Frontend  │
        │  Image Upload   │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ FastAPI Backend │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Image           │
        │ Preprocessing   │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Deep Learning   │
        │ Model           │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Prediction      │
        │ AI / REAL       │
        └─────────────────┘