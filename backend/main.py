from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import Any, Dict, Optional
import pandas as pd
import joblib
import warnings
import json
import os

warnings.filterwarnings("ignore", category=UserWarning)

BASE_DIR = os.path.dirname(__file__)
CHAMPION_MODEL_PATH = os.path.join(BASE_DIR, "gradient_boosting_model.pkl")
RF_MODEL_PATH = os.path.join(BASE_DIR, "cardiovascular_model.pkl")
BENCHMARK_PATH = os.path.join(BASE_DIR, "benchmark_results.json")

# Model Registry
models: Dict[str, Any] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager to load ML models on startup."""
    global models
    
    # 1. Load Champion Gradient Boosting Model
    if os.path.isfile(CHAMPION_MODEL_PATH):
        models["gradient_boosting"] = joblib.load(CHAMPION_MODEL_PATH)
        print("Loaded Champion Model: Gradient Boosting")
    else:
        print(f"Warning: Champion model not found at {CHAMPION_MODEL_PATH}")

    # 2. Load Random Forest Model
    if os.path.isfile(RF_MODEL_PATH):
        models["random_forest"] = joblib.load(RF_MODEL_PATH)
        print("Loaded Model: Random Forest")
    else:
        print(f"Warning: Random Forest model not found at {RF_MODEL_PATH}")

    # Ensure at least one model is active
    if not models:
        raise RuntimeError("No machine learning models could be loaded.")
        
    yield


app = FastAPI(
    title="CardioCare Multi-Model API",
    description="Cardiovascular Disease Risk Stratification powered by Champion Gradient Boosting & Random Forest Ensembles",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS Middleware configuration supporting local dev, Vercel deployments, and custom domains
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
custom_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:3000",
    "http://localhost:8501",
    "http://127.0.0.1:8501",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=default_origins + custom_origins if "*" not in custom_origins else ["*"],
    allow_origin_regex=r"^https?://([a-zA-Z0-9-]+\.)*(vercel\.app|localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PatientData(BaseModel):
    age_years: int = Field(ge=1, le=120, description="Age in years (1 - 120)", example=50)
    gender: int = Field(ge=1, le=2, description="1 for Male, 2 for Female", example=1)
    height: float = Field(gt=50, le=250, description="Height in centimeters (cm)", example=170.0)
    weight: float = Field(gt=10, le=300, description="Weight in kilograms (kg)", example=70.0)
    ap_hi: int = Field(gt=50, le=300, description="Systolic Blood Pressure (mmHg)", example=120)
    ap_lo: int = Field(gt=30, le=250, description="Diastolic Blood Pressure (mmHg)", example=80)
    cholesterol: int = Field(ge=1, le=3, description="1: Normal, 2: Above normal, 3: Well above normal", example=1)
    gluc: int = Field(ge=1, le=3, description="1: Normal, 2: Above normal, 3: Well above normal", example=1)
    smoke: int = Field(ge=0, le=1, description="0: Non-smoker, 1: Smoker", example=0)
    alco: int = Field(ge=0, le=1, description="0: Non-drinker, 1: Drinker", example=0)
    active: int = Field(ge=0, le=1, description="0: Inactive, 1: Physically active", example=1)
    model_choice: Optional[str] = Field(default="gradient_boosting", description="Target model: 'gradient_boosting' (Champion) or 'random_forest'")


class DerivedFeatures(BaseModel):
    bmi: float = Field(description="Body Mass Index (kg/m^2)")
    pulse_pressure: int = Field(description="ap_hi minus ap_lo (mmHg)")
    hypertension: int = Field(description="1 if Stage 1/2 Hypertension, else 0")


class PredictionResponse(BaseModel):
    prediction: int = Field(description="0 for Low Risk, 1 for High Risk")
    probability: float = Field(description="Calculated model probability (0.0 to 1.0)")
    risk_percentage: float = Field(description="Risk probability percentage (0% to 100%)")
    risk_label: str = Field(description="'Low Risk' or 'High Risk'")
    model_used: str = Field(description="Name and badge of model architecture used")
    derived_features: DerivedFeatures


@app.get("/")
def root() -> Dict[str, Any]:
    return {
        "service": "CardioCare Multi-Model API",
        "status": "running",
        "champion_model": "Gradient Boosting (80.04% ROC-AUC)",
        "available_models": list(models.keys()),
        "model_loaded": len(models) > 0,
        "prediction_endpoint": "/predict",
        "benchmark_endpoint": "/benchmark",
        "docs_url": "/docs",
    }


@app.get("/health")
def health() -> Dict[str, Any]:
    return {
        "status": "ok",
        "model_loaded": len(models) > 0,
        "champion_active": "gradient_boosting" in models,
        "models_available": list(models.keys())
    }


@app.get("/benchmark")
def get_benchmark() -> Dict[str, Any]:
    """Returns the multi-model classification benchmark results across all 6 architectures."""
    if os.path.isfile(BENCHMARK_PATH):
        with open(BENCHMARK_PATH, "r") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Benchmark results not found.")


@app.post("/predict", response_model=PredictionResponse)
def predict_risk(data: PatientData, model_type: Optional[str] = Query(default=None)):
    # Determine which model architecture to use
    selected_name = model_type or data.model_choice or "gradient_boosting"
    selected_name = selected_name.lower().strip()

    if selected_name in ("gradient_boosting", "champion", "gb"):
        active_model = models.get("gradient_boosting") or models.get("random_forest")
        display_name = "Gradient Boosting (Champion)"
    elif selected_name in ("random_forest", "rf"):
        active_model = models.get("random_forest") or models.get("gradient_boosting")
        display_name = "Random Forest Ensemble"
    else:
        active_model = models.get("gradient_boosting") or models.get("random_forest")
        display_name = "Gradient Boosting (Champion)"

    if active_model is None:
        raise HTTPException(status_code=503, detail="Prediction models are not loaded.")

    if data.ap_hi <= data.ap_lo:
        raise HTTPException(
            status_code=400,
            detail="Systolic BP must be greater than Diastolic BP.",
        )

    bmi = data.weight / ((data.height / 100) ** 2)
    pulse_pressure = data.ap_hi - data.ap_lo
    hypertension = int(data.ap_hi >= 140 or data.ap_lo >= 90)

    input_data = pd.DataFrame(
        {
            "age_years": [data.age_years],
            "gender": [data.gender],
            "height": [data.height],
            "weight": [data.weight],
            "ap_hi": [data.ap_hi],
            "ap_lo": [data.ap_lo],
            "cholesterol": [data.cholesterol],
            "gluc": [data.gluc],
            "smoke": [data.smoke],
            "alco": [data.alco],
            "active": [data.active],
            "BMI": [bmi],
            "pulse_pressure": [pulse_pressure],
            "hypertension": [hypertension],
        }
    )

    try:
        prediction = int(active_model.predict(input_data)[0])
        probabilities = active_model.predict_proba(input_data)[0]
        probability = float(probabilities[1])
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed with model {display_name}: {str(exc)}",
        )

    return {
        "prediction": prediction,
        "probability": probability,
        "risk_percentage": round(probability * 100, 1),
        "risk_label": "High Risk" if prediction == 1 else "Low Risk",
        "model_used": display_name,
        "derived_features": {
            "bmi": round(bmi, 2),
            "pulse_pressure": pulse_pressure,
            "hypertension": hypertension,
        },
    }
