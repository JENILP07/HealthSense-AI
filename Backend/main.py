from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
import os
import logging

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS Configuration
# Production Best Practice: Only allow your specific frontend domain
# Default to "*" for development convenience
frontend_url = os.getenv("FRONTEND_URL", "*")
origins = [frontend_url] if frontend_url != "*" else ["*"]

logger.info(f"CORS Origins configured: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models
MODEL_PATH = "models/tuned_gb_best.pkl"
SCALER_PATH = "models/scaler.pkl"
THRESHOLD_PATH = "models/best_threshold.pkl"

try:
    if not os.path.exists(MODEL_PATH):
        # Fallback for development if run from root
        MODEL_PATH = "Backend/models/tuned_gb_best.pkl"
        SCALER_PATH = "Backend/models/scaler.pkl"
        THRESHOLD_PATH = "Backend/models/best_threshold.pkl"

    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    threshold_val = joblib.load(THRESHOLD_PATH)
    logger.info("✅ Models loaded successfully")
except Exception as e:
    logger.error(f"❌ Error loading models: {e}")
    model = None
    scaler = None
    threshold_val = 0.5

# Input Schema
class PatientData(BaseModel):
    age: float  # Age in Years
    gender: int # 1: Female, 2: Male
    height: float # cm
    weight: float # kg
    ap_hi: float
    ap_lo: float
    cholesterol: int # 1, 2, 3
    gluc: int       # 1, 2, 3
    smoke: int      # 0, 1
    alco: int       # 0, 1
    active: int     # 0, 1

@app.get("/")
def read_root():
    return {"message": "Vital Clarity Engine API"}

@app.post("/predict")
def predict_heart_risk(data: PatientData):
    if not model or not scaler:
        logger.critical("Prediction attempted with models not loaded")
        raise HTTPException(status_code=500, detail="Models not loaded")

    try:
        # 1. Prepare raw input (Age Years -> Days)
        age_days = data.age * 365
        
        input_dict = {
            "age": age_days,
            "gender": data.gender,
            "height": data.height,
            "weight": data.weight,
            "ap_hi": data.ap_hi,
            "ap_lo": data.ap_lo,
            "cholesterol": data.cholesterol,
            "gluc": data.gluc,
            "smoke": data.smoke,
            "alco": data.alco,
            "active": data.active
        }
        
        df = pd.DataFrame([input_dict])
        
        # 2. Scale Numerical Columns
        # Note: Scaler expects Age in Days
        num_cols = ["age", "height", "weight", "ap_hi", "ap_lo"]
        df[num_cols] = scaler.transform(df[num_cols])
        
        # 3. Feature Engineering from RAW values
        # BMI
        bmi = data.weight / ((data.height / 100) ** 2)
        df["bmi"] = bmi
        
        # Age Category (Applied on SCALED inputs as per training pipeline logic)
        # Bins: [-inf, -0.4, 0.0, 0.5, inf]
        df["age_category"] = pd.cut(df["age"], 
                                    bins=[-np.inf, -0.4, 0.0, 0.5, np.inf], 
                                    labels=[1,2,3,4], ordered=False).astype(int)
        
        # BP Category (from RAW ap_hi)
        df["bp_category"] = pd.cut([data.ap_hi], 
                                   bins=[0, 120, 130, 140, 1000], 
                                   labels=[1,2,3,4], ordered=False).astype(int)
        
        # BMI Category (from RAW bmi)
        df["bmi_category"] = pd.cut([bmi], 
                                    bins=[0, 25, 30, 35, 100], 
                                    labels=[1,2,3,4], ordered=False).astype(int)
        
        # Reorder
        if hasattr(model, "feature_names_in_"):
            df = df[model.feature_names_in_]
            
        # Predict
        proba = model.predict_proba(df)[0, 1]
        prediction = 1 if proba >= threshold_val else 0
        
        logger.info(f"Prediction made: Risk={prediction}, Probability={proba:.4f}")
        
        return {
            "prediction": int(prediction),
            "probability": float(round(proba, 4)),
            "risk_label": "High Risk" if prediction == 1 else "Low Risk"
        }

    except Exception as e:
        logger.error(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Use PORT env var for deployment (e.g. Heroku, Render)
    port = int(os.getenv("PORT", 8000))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
