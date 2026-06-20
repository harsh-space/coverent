import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

def train_forecaster():
    """
    Trains the Predictive Disruption Forecaster using XGBoost Regressor.
    Inputs are loaded from ml/data/forecast_training_data.csv.
    Saves the model as ml/models/disruption_forecaster.pkl.
    """
    data_path = 'ml/data/forecast_training_data.csv'
    if not os.path.exists(data_path):
        print("Error: Training data not found. Please run generate_forecast_data.py first.")
        return
        
    df = pd.read_csv(data_path)
    
    features = [
        'historical_trigger_frequency',
        'active_enrolled_riders',
        'rain_forecast_score',
        'aqi_forecast_score'
    ]
    
    X = df[features]
    y = df['estimated_claims']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = xgb.XGBRegressor(
        n_estimators=150,
        learning_rate=0.1,
        max_depth=5,
        random_state=42,
        objective='reg:squarederror'
    )
    
    print("Training Predictive Disruption Forecaster (XGBoost)...")
    model.fit(X_train, y_train)
    
    predictions = model.predict(X_test)
    # Claims cannot be negative
    predictions = np.clip(np.round(predictions), 0, None)
    
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    print(f"\n--- Evaluation ---")
    print(f"Mean Absolute Error: {mae:.2f} claims")
    print(f"R2 Score: {r2:.4f}")
    
    # Save model
    models_dir = 'ml/models'
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, 'disruption_forecaster.pkl')
    joblib.dump(model, model_path)
    print(f"\nModel saved successfully to {model_path}")

if __name__ == "__main__":
    train_forecaster()
