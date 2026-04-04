import pandas as pd
import numpy as np
import os

def generate_risk_data(n_samples=1500):
    """
    Generates synthetic data for the Zone Risk Scoring Engine based on the new formula.
    Features:
    - zone_flood_score (int 0-10)
    - zone_aqi_score (int 0-10)
    - shift_pattern_score (int 0-10)
    - city_tier (int 0 or 1)
    - historical_claim_rate (float 0.0-1.0)
    - zone_composite_score (int 0-10)
    Target:
    - risk_score (int 0-100)
    """
    np.random.seed(42)
    
    zone_flood_score = np.random.randint(0, 11, n_samples)
    zone_aqi_score = np.random.randint(0, 11, n_samples)
    shift_pattern_score = np.random.randint(0, 11, n_samples)
    city_tier = np.random.randint(0, 2, n_samples)
    historical_claim_rate = np.round(np.random.uniform(0.0, 1.0, n_samples), 2)
    zone_composite_score = np.random.randint(0, 11, n_samples)
    
    noise = np.random.uniform(-5, 5, n_samples)
    
    base_score = (
        zone_flood_score * 2.0 +
        zone_aqi_score * 1.5 +
        shift_pattern_score * 1.2 +
        city_tier * 5 +
        historical_claim_rate * 20 +
        zone_composite_score * 1.8 +
        noise
    )
    
    # Normalize base score to 0-100 (Max theoretical was roughly around 85+noise without normalization, but we can just clip it)
    risk_score = np.clip(base_score, 0, 100).astype(int)
    
    df = pd.DataFrame({
        'zone_flood_score': zone_flood_score,
        'zone_aqi_score': zone_aqi_score,
        'shift_pattern_score': shift_pattern_score,
        'city_tier': city_tier,
        'historical_claim_rate': historical_claim_rate,
        'zone_composite_score': zone_composite_score,
        'risk_score': risk_score
    })
    
    os.makedirs('ml/data', exist_ok=True)
    df.to_csv('ml/data/risk_training_data.csv', index=False)
    print(f"Generated {n_samples} samples and saved to ml/data/risk_training_data.csv")

if __name__ == "__main__":
    generate_risk_data()
