import pandas as pd
import numpy as np
import os

def generate_forecast_data(n_samples=3000):
    """
    Generates synthetic 7-day forecast training data for the Disruption Forecaster.
    Features:
    - historical_trigger_frequency (float 0.0 to 1.0): Zone's baseline disruption rate
    - active_enrolled_riders (int): Number of riders in the zone with active policies
    - rain_forecast_score (float 0 to 10): 7-day severe rain probability score
    - aqi_forecast_score (float 0 to 10): 7-day severe AQI probability score
    Target:
    - estimated_claims (int): Total expected claims for the week
    """
    np.random.seed(42)
    
    historical_trigger_frequency = np.round(np.random.uniform(0.0, 1.0, n_samples), 2)
    active_enrolled_riders = np.random.randint(10, 1000, n_samples)
    rain_forecast_score = np.random.uniform(0.0, 10.0, n_samples)
    aqi_forecast_score = np.random.uniform(0.0, 10.0, n_samples)
    
    # Statistical Noise
    noise = np.random.normal(0, 0.05, n_samples)
    
    # Claim Generation Formula
    # Baseline vulnerability is driven by historical frequency
    # Weather spikes (rain/aqi) increase the claim rate
    # E.g., if Rain is 10/10, we expect ~15% of active riders to claim. If AQI is 10/10, ~10%.
    
    rain_impact = rain_forecast_score * 0.015 
    aqi_impact = aqi_forecast_score * 0.010
    base_impact = historical_trigger_frequency * 0.05
    
    total_claim_rate = np.clip(rain_impact + aqi_impact + base_impact + noise, 0, 1.0)
    
    estimated_claims = np.round(active_enrolled_riders * total_claim_rate).astype(int)
    
    df = pd.DataFrame({
        'historical_trigger_frequency': historical_trigger_frequency,
        'active_enrolled_riders': active_enrolled_riders,
        'rain_forecast_score': np.round(rain_forecast_score, 2),
        'aqi_forecast_score': np.round(aqi_forecast_score, 2),
        'estimated_claims': estimated_claims
    })
    
    os.makedirs('ml/data', exist_ok=True)
    df.to_csv('ml/data/forecast_training_data.csv', index=False)
    print(f"Generated {n_samples} forecast samples.")
    print(f"Saved to ml/data/forecast_training_data.csv")

if __name__ == "__main__":
    generate_forecast_data()
