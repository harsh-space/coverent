import joblib
import os
import pandas as pd
import numpy as np
from pathlib import Path

# Bulletproof pathing
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
MODEL_DIR = ROOT_DIR / 'ml' / 'models'
DATA_DIR = ROOT_DIR / 'ml' / 'data'

class MLPricingService:
    def __init__(self):
        self.score_model = None
        self.pincode_df = None
        self._init_done = False

    def _ensure_loaded(self):
        if self._init_done:
            return
        try:
            score_path = MODEL_DIR / 'risk_score_model.pkl'
            pincode_db_path = DATA_DIR / 'pincode_historical_data.csv'
            
            print(f"DEBUG: [ML] Root Dir: {ROOT_DIR}")
            print(f"DEBUG: [ML] Model Path: {score_path}")
            print(f"DEBUG: [ML] Data Path: {pincode_db_path}")

            if score_path.exists():
                try:
                    self.score_model = joblib.load(score_path)
                    print(f"DEBUG: [ML] Model Loaded Successfully.")
                except Exception as e:
                    print(f"ERROR: [ML] Joblib load failed: {e}")
                    traceback.print_exc()
            else:
                print(f"WARNING: [ML] Model file NOT found at {score_path}")
            
            if pincode_db_path.exists():
                self.pincode_df = pd.read_csv(pincode_db_path)
                self.pincode_df['pincode'] = self.pincode_df['pincode'].astype(str).str.strip()
                print(f"DEBUG: [ML] Pincode Database Loaded. Rows: {len(self.pincode_df)}")
            else:
                print(f"WARNING: [ML] Pincode database NOT found at {pincode_db_path}")
            
            self._init_done = True
        except Exception as e:
            print(f"ERROR: [ML] Lazy Load failed: {e}")
            import traceback
            traceback.print_exc()

    def predict_risk_and_premium(self, pincode: str, tier_val: str, shift_val: str, prior_claims: int = 0):
        try:
            self._ensure_loaded()
            
            p_str = str(pincode).strip()
            z_f, z_a, c_t = 3, 4, 0

            if self.pincode_df is not None:
                row = self.pincode_df[self.pincode_df['pincode'] == p_str]
                if not row.empty:
                    z_f = int(row.iloc[0]['flood_score'])
                    z_a = int(row.iloc[0]['aqi_score'])
                    c_t = int(row.iloc[0]['city_tier'])
            
            comp = (z_f + z_a) // 2
            s_map = {'morning': 2, 'evening': 6, 'full_day': 10}
            s_score = s_map.get(str(shift_val).lower(), 5)
            c_rate = float(min(prior_claims * 0.15, 1.0))

            feat_cols = ['zone_flood_score', 'zone_aqi_score', 'shift_pattern_score', 'city_tier', 'historical_claim_rate', 'zone_composite_score']
            features = pd.DataFrame([[z_f, z_a, s_score, c_t, c_rate, comp]], columns=feat_cols)
            
            r_score = 74
            if self.score_model is not None:
                try:
                    r_score = int(np.clip(self.score_model.predict(features)[0], 0, 100))
                except Exception as e:
                    print(f"ERROR: [ML] Prediction crash: {e}")
            
            # Baseline Actuarial P_Weekly
            loading = int(((r_score / 1500.0) * 450.0) / 0.65 + 10.0)

            # Extract current pincode loss ratio (Pool Protection)
            l_ratio = int(row.iloc[0]['loss_ratio']) if not row.empty else 25
            
            return r_score, loading, {"zone_flood_score": z_f, "zone_aqi_score": z_a, "pincode_loss_ratio": l_ratio}
            
        except Exception as e:
            print(f"CRITICAL: [ML] predict_risk_and_premium failure: {e}")
            return 74, 45, {"zone_flood_score": 3, "zone_aqi_score": 4, "pincode_loss_ratio": 25}

    def get_dynamic_plans(self, tier_val: str, loading: int, score: int, loss_ratio: int = 0):
        """
        Calculates sustainable premiums based on README benchmarks.
        Base Premiums: Low: 89, Mid: 139, High: 179
        AI Loading: -20 to +30 based on score (74 = baseline)
        Pool Protection: Pincode Loss Ratio > 85% blocks new enrollment.
        """
        # 1. Start with README Base Tiers
        base_premiums = {
            'low': 89.0,
            'mid': 139.0,
            'high': 179.0
        }
        
        tier = str(tier_val).lower().strip()
        base_val = base_premiums.get(tier, 139.0)
        
        # 2. AI Loading (-20 to +30 range)
        # Neutral score is 74. If score > 74, increase. If < 74, decrease.
        score_adj = ((score - 74) / 74.0) * 50.0 # Proportional adjustment
        loading_val = np.clip(score_adj, -20, 30)
        
        total_base = base_val + loading_val
        
        # 3. Plan Level Multipliers
        # Lite (1 day cover), Plus (2 days cover), Max (3 days cover)
        return {
            "lite": int(total_base * 0.8),
            "plus": int(total_base),
            "max": int(total_base * 1.5),
            "is_restricted": bool(loss_ratio > 85), # BLOCK ONLY IF PINCODE POOL IS AT CAPACITY
            "risk_score": int(score),
            "pincode_loss_ratio": int(loss_ratio)
        }

ml_service = MLPricingService()
