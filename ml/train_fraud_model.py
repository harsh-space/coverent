import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import os

def train_fraud_model():
    """
    Trains the Fraud Detection Engine using Isolation Forest.
    Inputs are loaded from ml/data/fraud_training_data.csv.
    Saves the model as ml/models/fraud_detection_model.pkl.
    """
    
    data_path = 'ml/data/fraud_training_data.csv'
    if not os.path.exists(data_path):
        print("Error: Training data not found. Please run generate_fraud_data.py first.")
        return
    
    df = pd.read_csv(data_path)
    
    # Feature set for Isolation Forest
    features = [
        'location_continuity',
        'accelerometer_variance',
        'minutes_active_pre_trigger',
        'cell_tower_mismatch_meters',
        'zone_history_deliveries'
    ]
    
    X = df[features]
    
    # The 'is_fraud' column is ONLY for evaluating our synthetic data.
    # The IsolationForest is unsupervised and will NOT see this during training.
    y_true = df['is_fraud']
    
    # We set contamination to 0.05 because we synthetically generated 5% anomalies.
    # In a real-world scenario, this hyperparameter can be tuned or set based on estimated fraud rates.
    model = IsolationForest(
        n_estimators=100,
        contamination=0.05,
        random_state=42
    )
    
    print("Training Unsupervised Fraud Detection Model (Isolation Forest)...")
    model.fit(X)
    
    # Predict: -1 for anomalies (fraud), 1 for normal (genuine)
    predictions = model.predict(X)
    
    # Map predictions to 0 (genuine) and 1 (fraud) to compare with y_true
    y_pred = np.where(predictions == -1, 1, 0)
    
    print("\n--- Evaluation on Synthetic Data ---")
    print("Note: The model did NOT see the 'is_fraud' labels during training.")
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_true, y_pred))
    
    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=["Genuine (0)", "Fraud (1)"]))
    
    # Save model
    models_dir = 'ml/models'
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, 'fraud_detection_model.pkl')
    joblib.dump(model, model_path)
    
    print(f"\nModel saved successfully to {model_path}")

if __name__ == "__main__":
    train_fraud_model()
