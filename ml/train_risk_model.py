import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

def train_risk_model():
    """
    Trains the Zone Risk Scoring Engine using XGBoost.
    Inputs are loaded from ml/data/risk_training_data.csv.
    Saves the model as ml/models/risk_score_model.pkl.
    """
    
    data_path = 'ml/data/risk_training_data.csv'
    if not os.path.exists(data_path):
        print("Error: Training data not found. Please run generate_risk_data.py first.")
        return
    
    df = pd.read_csv(data_path)
    
    # Feature set
    features = [
        'zone_flood_score', 
        'zone_aqi_score', 
        'shift_pattern_score', 
        'city_tier', 
        'historical_claim_rate', 
        'zone_composite_score'
    ]
    
    X = df[features]
    y_score = df['risk_score']
    
    # Train Risk Score Model
    X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(X, y_score, test_size=0.2, random_state=42)
    
    model_score = xgb.XGBRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42,
        objective='reg:squarederror'
    )
    
    print("Training Risk Score Model...")
    model_score.fit(X_train_s, y_train_s)
    
    # Save model
    models_dir = 'ml/models'
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(model_score, os.path.join(models_dir, 'risk_score_model.pkl'))
    
    print(f"Model saved to {models_dir}")

if __name__ == "__main__":
    train_risk_model()
