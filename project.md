# Coverent: Parametric Income Insurance for Q-Commerce Riders

Coverent is a hyperlocal, AI-driven parametric insurance platform designed for delivery partners (Zepto, Blinkit, Swiggy Instamart). It provides automated income protection against disruptions like heavy rainfall, extreme heat, severe AQI, and platform outages.

## Key Value Proposition
- **Automated Payouts**: Payouts are triggered instantly when environmental thresholds are breached. No manual claims or paperwork required.
- **Hyperlocal Risk Scoring**: AI-driven pricing evaluated at the **pincode level**, ensuring premiums match the specific risk of the rider's ~2km delivery radius.
- **Zero-Friction Cycle**: Synchronized with weekly gig worker payout cycles for seamless protection.

---

## AI Risk Scoring Engine (XGBoost)

The core of Coverent's pricing intelligence is a custom-trained **XGBoost Regressor** model. Unlike generic insurance models, this engine operates on a granular dataset to evaluate localized risk.

### **Model Features & Weights**
The engine processes 6 key features to determine a **0–100 Risk Score**:
1.  **Zone Flood History (High Weight)**: 3-year historical waterlogging frequency for the specific pincode.
2.  **Seasonal AQI Severity (High Weight)**: Predicted probability of AQI exceeding 301 based on historical trends.
3.  **Historical Claim Rate (Medium Weight)**: Prior payout data from the same zone to identify established "hotspots."
4.  **Zone Composite Score (Medium Weight)**: A blended score reflecting local infrastructure and drainage capacity.
5.  **Shift Pattern (Medium Weight)**: Adjusts risk based on whether the rider operates during high-risk windows (e.g., evening peak).
6.  **City Tier (Low Weight)**: Baseline infrastructure adjustments for Metros vs. Tier-2 cities.

### **Dynamic Pricing Impact**
The Risk Score (Neutral baseline = 74) directly influences the **AI Loading Factor**, which adjusts the weekly premium by **-₹20 to +₹30**. This ensures that riders in safer zones pay less, while higher-risk areas remain actuarially sustainable.

---

## Hyperlocal Precision: The "2km Radius"

Coverent solves the "city-wide bias" problem in traditional insurance.
- **Granularity**: Risk is calculated at the **Pincode level**. A rider in a flood-prone dark store in Rohini, Delhi, has a different risk profile and premium than a rider in a safer pocket of the same city.
- **Operational Reality**: Since Q-Commerce riders typically operate within a **1.5km to 2km radius** of their dark store, our model captures the exact physical environmental risks they face during their shift.
- **Pool Protection**: If a specific pincode's loss ratio exceeds **85%**, the AI temporarily restricts new policy enrollments to ensure the solvency of the local payout pool.

---

## Automated Trigger Engine

The **Trigger Engine** is a dedicated background service that acts as the "Decision Maker" for payouts.

### **Real-time Monitoring**
The engine continuously polls weather, AQI, and platform APIs. It evaluates these inputs against strict **Parametric Thresholds**:
- **Heavy Rainfall**: > 5.0 mm/hr (triggers "Severe" payout tier).
- **Extreme Heat**: > 42.0°C (during active shift windows).
- **Severe AQI**: > 400.0 (hazardous level).
*   **Platform Outage**: Detected platform downtime > 45 minutes during peak 6-11 PM slots.

### **Automation Flow**
When a threshold is breached, the engine automatically:
1.  Identifies all riders with **Active Policies** in the affected pincode.
2.  Calculates individual payouts based on their **Income Tier** (Low/Mid/High).
3.  Initiates the payout sequence to the backend, which syncs with Firestore for instant PWA notification.

---

## Mock Triggers & Demo Mode

For demonstration and testing purposes, the Insurer Dashboard includes a **Mock Trigger System**.
- **Manual Authorisation**: Insurers can simulate any event (e.g., a flash flood in Mumbai Pincode 400053) to verify the end-to-end flow.
- **Testing Logic**: This ensures that even in "off-seasons," stakeholders can validate the speed of the notification system and the accuracy of the payout calculations.

---

## Stress Testing & Security (Input Validation)

To ensure the platform could survive a high-stakes competitive environment, rigorous **Stress Testing** was performed:
- **Backend Robustness**: Identified and patched 500 Internal Server Errors in the pricing API by implementing robust error handling and path fallbacks.
- **Input Validation**: Hardened all rider registration and login inputs to prevent injection and ensure data integrity in Firestore.
- **Adaptive UI**: Refined the Rider PWA's responsive design to prevent text clipping and ensure accessibility across all Android/iOS devices used by gig workers.
- **Notification Reliability**: Implemented a redundant notification system that ensures payout alerts appear even if the PWA is running in the background.

---

