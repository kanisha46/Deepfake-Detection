# Deepfake Detection - React Frontend

Academic research dashboard and live inference UI for cross-dataset deepfake detection.

## Structure
```
frontend/
├── src/
│   ├── components/       # UI components (Navbar, ImageUpload, PredictionResult, GradCAMViewer, ModelSelector)
│   ├── pages/            # Home, Detection, Results, Experiments, Research, About
│   ├── services/api.js   # Axios client (uses VITE_API_URL)
│   ├── App.jsx           # React Router
│   ├── main.jsx          # Root render
│   └── index.css         # Light theme design system
├── .env.example
├── package.json
└── vite.config.js
```

## Setup & Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # VITE_API_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev -- --port 5173
   ```

4. **Build production bundle:**
   ```bash
   npm run build
   ```
