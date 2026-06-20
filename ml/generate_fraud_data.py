import pandas as pd
import numpy as np
import os

def generate_fraud_data(n_samples=5000, fraud_ratio=0.05):
    """
    Generates synthetic data for the Fraud Detection Engine based on 5 anti-spoofing signals.
    Features:
    - location_continuity (float 0.0 to 1.0): 1 is gradual natural movement, 0 is teleporting.
    - accelerometer_variance (float): High means natural phone motion on a bike. Low means stationary.
    - minutes_active_pre_trigger (int): Minutes rider was online taking orders before the trigger fired.
    - cell_tower_mismatch_meters (float): Distance between GPS ping and closest connected cell tower.
    - zone_history_deliveries (int): Number of deliveries completed in this specific zone in the last 4 weeks.
    Target:
    - is_fraud (int 0 or 1): 1 for spoofer, 0 for genuine. Used for evaluation, not training.
    """
    np.random.seed(42)
    
    n_fraud = int(n_samples * fraud_ratio)
    n_genuine = n_samples - n_fraud
    
    # --- Generate Genuine Riders ---
    # They have continuous movement, high accelerometer activity, were active before the storm,
    # match their cell towers, and have a history in the zone.
    gen_loc_continuity = np.random.uniform(0.7, 1.0, n_genuine)
    gen_accel_var = np.random.normal(5.0, 1.5, n_genuine) # High variance
    gen_mins_active = np.random.randint(20, 240, n_genuine)
    gen_cell_mismatch = np.random.uniform(0, 800, n_genuine) # Usually within 800m
    gen_zone_history = np.random.randint(5, 200, n_genuine)
    
    # --- Generate Fraud/Spoofer Rings ---
    # They teleport in (low continuity), their phone is on a desk (low accel), 
    # they logged in right at the trigger time (0 mins), their GPS contradicts cell towers,
    # and they have no history in this random zone.
    fraud_loc_continuity = np.random.uniform(0.0, 0.3, n_fraud)
    fraud_accel_var = np.random.normal(0.2, 0.1, n_fraud) # Near zero variance
    fraud_mins_active = np.random.randint(0, 5, n_fraud) # Logged in exactly at trigger
    fraud_cell_mismatch = np.random.uniform(2000, 10000, n_fraud) # Far away from reported GPS
    fraud_zone_history = np.random.randint(0, 2, n_fraud) # Essentially zero history
    
    # Combine arrays
    location_continuity = np.concatenate([gen_loc_continuity, fraud_loc_continuity])
    accelerometer_variance = np.concatenate([gen_accel_var, fraud_accel_var])
    minutes_active_pre_trigger = np.concatenate([gen_mins_active, fraud_mins_active])
    cell_tower_mismatch_meters = np.concatenate([gen_cell_mismatch, fraud_cell_mismatch])
    zone_history_deliveries = np.concatenate([gen_zone_history, fraud_zone_history])
    is_fraud = np.concatenate([np.zeros(n_genuine), np.ones(n_fraud)])
    
    # Ensure no negative values where impossible
    accelerometer_variance = np.clip(accelerometer_variance, 0, None)
    
    # Create DataFrame
    df = pd.DataFrame({
        'location_continuity': location_continuity,
        'accelerometer_variance': accelerometer_variance,
        'minutes_active_pre_trigger': minutes_active_pre_trigger,
        'cell_tower_mismatch_meters': cell_tower_mismatch_meters,
        'zone_history_deliveries': zone_history_deliveries,
        'is_fraud': is_fraud.astype(int)
    })
    
    # Shuffle dataset
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    os.makedirs('ml/data', exist_ok=True)
    df.to_csv('ml/data/fraud_training_data.csv', index=False)
    print(f"Generated {n_samples} total samples ({n_genuine} genuine, {n_fraud} fraud/anomalies).")
    print(f"Saved to ml/data/fraud_training_data.csv")

if __name__ == "__main__":
    generate_fraud_data()
