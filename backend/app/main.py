import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.models import router as models_router
from app.routes.predict import router as predict_router
from app.routes.experiments import router as experiments_router
from app.models.model_loader import registry

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("deepfake_backend")

app = FastAPI(
    title="AI-Powered Deepfake Detection API",
    description="Research-grade inference system using EfficientNet-B0 and Vision Transformer (ViT-B/16) for authentic vs manipulated media classification.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(health_router)
app.include_router(models_router)
app.include_router(predict_router)
app.include_router(experiments_router)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing Deepfake Detection Backend Service...")
    logger.info(f"Loaded models: {list(registry.models.keys())}")
    logger.info(f"Active default model: {registry.active_model_id}")
    logger.info(f"Compute device: {registry.device}")

@app.get("/")
def root():
    return {
        "title": "AI-Powered Deepfake Detection System API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "health": "/health",
        "active_model": registry.active_model_id
    }
