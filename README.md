# GigShield - Parametric Income Insurance for Q-Commerce Riders

> Automated weekly income protection for Zepto / Blinkit / Swiggy Instamart delivery partners. When a disruption is detected, the payout goes out automatically. No claim forms. No waiting.

---

## The Problem

A full-time Blinkit or Zepto rider earns ₹800–₹1,200/day working 9–10 hours out of a single dark store. Their entire income depends on a 1.5–2km delivery radius staying operational.

One flooded road, one severe AQI day, one platform outage during peak hours — and that day's income is gone. No compensation. No safety net. Over a Delhi monsoon season, riders lose 4–6 such days, translating to ₹3,800–₹5,700 in unprotected income loss.

GigShield insures that lost income — automatically, weekly, and built exclusively for Q-Commerce riders.

---

## Persona: The Q-Commerce Rider

- Works out of one fixed dark store (Zepto / Blinkit / Swiggy Instamart)
- Delivers within a 1.5–2km radius, completing 3–5 orders/hour at peak
- Earns ₹20–₹35/order base + distance pay + milestone incentives
- Peak earning window: 6–11 PM (~40% of daily income)
- Weekly earnings: ₹3,000–₹7,200 depending on city and hours worked

The 10-minute delivery promise means even a 45-minute disruption during peak hours causes disproportionate income loss — not just fewer orders, but missed incentive slabs too.

---

## Worker Scenarios

### Scenario 1 — Ravi, Blinkit Rider, Delhi (Monsoon Waterlogging)

Ravi earns ₹950/day out of a dark store in Rohini. On August 13, 2024, IMD issues a Red Alert for Delhi-NCR. Two roads within 2km of his dark store are waterlogged by 11 AM. Order completions in his zone drop below 40%. He cannot safely ride.

**Without GigShield:** Full day lost — ₹950 gone. Over 4–6 such days per monsoon season, that's ₹3,800–₹5,700 with zero recourse.

**With GigShield:** IMD Red Alert + maps API confirms flooding within 2km of Ravi's registered dark store. Trigger fires automatically. ₹665 (70% of his daily average) is credited to his UPI by 2 PM — while the roads are still flooded.

---

### Scenario 2 — Priya, Zepto Rider, Delhi (Severe AQI)

Priya works the 6–11 PM peak slot in Dwarka, earning ₹780 on an average evening. On November 18, 2024, Delhi's AQI hits 491 — CPCB's "Severe Plus" classification. She logs off after 90 minutes, completing 6 orders instead of her usual 18–20. Evening earnings: ₹210.

**Without GigShield:** ₹570 lost that evening. Delhi's AQI exceeded 400 for 9 consecutive days in November 2024 — months of exposure with no protection.

**With GigShield:** CPCB AQI feed confirms AQI ≥301 in Dwarka for 3+ consecutive hours during Priya's active shift. Trigger fires. ₹455 credited to UPI within 2 hours — partial compensation for every qualifying AQI evening that month.

---

### Scenario 3 — Arjun, Swiggy Instamart Rider, Mumbai (Platform Outage)

Arjun earns ₹1,050/day in Andheri West. On a Friday at 7:23 PM, Swiggy's order-assignment system goes down for 52 minutes. He completes 4 orders instead of his usual 14. He also misses his weekly incentive milestone — the outage cost him the orders needed to cross the next slab.

**Without GigShield:** ₹280 direct order loss + ₹300 missed incentive bonus = ₹580 gone on a single Friday night.

**With GigShield:** Platform status monitor detects downtime >45 minutes during the 6–10 PM peak. Arjun's GPS confirms he was active in his registered zone. Fraud check clears. ₹385 credited to UPI before midnight.

---

## Platform Choice: Hybrid (PWA + Web Dashboard)

**Rider Interface — Progressive Web App (PWA)**
Every Q-Commerce rider owns a smartphone — it is a mandatory requirement to join Blinkit, Zepto, or Swiggy Instamart. A PWA is accessible via browser link, installable to home screen, and push-notification capable with zero installation barrier. No Play Store approval, no storage friction, works on any Android device.

**Insurer / Admin Interface — Web Dashboard**
The insurer-side user monitors live triggers, reviews flagged claims, and tracks loss ratios at a desk. This requires data-dense views — maps, charts, claim queues — that are web-only use cases.

**Result:** Two interfaces, one backend, right tool for each user.

---

## Application Workflow

> 📊 **[INSERT FLOWCHART HERE]** — End-to-end flow: Rider registers → AI scores zone → Policy purchase → Trigger monitoring (24/7) → Trigger fires → Fraud check → Payout to UPI → Insurer dashboard updates in real time

### Rider PWA (6 Steps)

**Step 1 — Onboarding (one-time, ~3 min)**
OTP login → select platform → platform ID upload → Aadhaar eKYC → 
dark store pincode → UPI ID → income tier (Low/Mid/High).

**Step 2 — AI Risk Profiling (automatic, ~60 sec)**
No rider action. Zone scored (0–100) from historical weather + AQI data.
Rider sees: *"Zone risk: 74/100. Recommended: Suraksha Plus."*

**Step 3 — Weekly Policy Purchase**
Select plan → pay via UPI → active Monday to Sunday → 
auto-renewal prompt every Sunday.

**Step 4 — Trigger Monitoring (continuous, no rider action)**
System polls weather, AQI, and platform APIs automatically.
Trigger fires only if policy is active and rider was online.

**Step 5 — Auto Claim + Fraud Check (<2 min)**
3 checks run simultaneously: GPS validation, duplicate check, 
anomaly detection. All pass → approved. Any flag → manual review.

**Step 6 — Payout**
Amount calculated → sent to UPI → push notification to rider.
Target: within 2 hours of trigger.

---

### Insurer Web Dashboard

> 📊 **[INSERT DASHBOARD WIREFRAME HERE]** — 4-panel layout: Live Trigger Map / Claims Queue / Analytics / Policy Management

| View | What It Shows |
|---|---|
| Live Trigger Map | Active parametric events with zone overlays: waterlogging (blue), heat (red), AQI (grey), closure (yellow), outage (orange). Affected active riders per zone. |
| Claims Queue | Auto-approved claims (last 24 hrs) + flagged claims with failed fraud check detail + rider GPS trail. |
| Analytics | Weekly premium vs. payouts (loss ratio), zone-wise claim heatmap, 7-day predicted payout liability, renewal rate. |
| Policy Management | Active policies, income tier distribution, manual zone risk override, CSV export. |

---

## Weekly Premium Model

### Why Weekly?

77.6% of gig workers in India earn ₹2.5 lakh or less per year. Zepto and Blinkit both run weekly payout cycles (Monday–Sunday, credited by Tuesday). GigShield's premium deducts from that payout automatically — the rider never needs to actively pay. Zero friction, zero defaults.

### Income Tiers

| Tier | Weekly Earnings | Monthly Equivalent | Profile |
|---|---|---|---|
| Low | ₹3,000–₹4,200 | ₹12,000–₹15,000 | Part-time / Tier-2 city |
| Mid | ₹4,800–₹6,000 | ₹25,000–₹30,000 | Full-time / Metro |
| High | ₹6,600–₹7,200 | ₹30,000–₹40,000 | High-performer / Metro |

*Source: Blinkit/Zepto official partner earnings data, Invezz gig worker survey 2025*

### Premium Formula

```
Weekly Premium = Base Premium + AI Risk Loading
```

**Base Premium — 2.5% of weekly income (parametric microinsurance benchmark)**

| Tier | Base Premium |
|---|---|
| Low | ₹89/week |
| Mid | ₹139/week |
| High | ₹179/week |

**AI Risk Loading — XGBoost model, range: -₹20 to +₹30**

| Input Feature | Source | Weight |
|---|---|---|
| 3-year waterlogging frequency (pincode) | IMD historical | High |
| Seasonal AQI severity score | CPCB / AQICN historical | High |
| City tier (metro / Tier-2 / Tier-3) | Registration data | Medium |
| Dark store zone composite risk score | City flood + OSM maps | Medium |
| Rider's active shift window | Platform API (simulated) | Low |
| Rider's prior claim count | Internal DB | Low |

*Example: Mid-tier rider in Rohini, Delhi pays ₹169/week. Same tier in Kharadi, Pune pays ₹119/week.*

### Coverage Plans

| Plan | Max Covered Days/Week | Max Payout/Week |
|---|---|---|---|
| Suraksha Lite | 1 day | ₹700 |
| Suraksha Plus | 2 days | ₹1,400 |
| Suraksha Max | 3 days | ₹2,100 |

### Payout Formula

```
Payout = (Declared weekly income ÷ 6) × 0.70 × Disrupted days
```

The 0.70 factor (70% income replacement) prevents over-insurance moral hazard — riders should not earn more by not working than by working.

**Example — Mid tier, Suraksha Plus, 1 disrupted day:**
`(₹5,400 ÷ 6) × 0.70 × 1 = ₹630 → UPI within 2 hours`

### Business Viability

Assuming 10,000 enrolled riders across Delhi-NCR + Mumbai:
- Weekly premiums: ₹139 × 10,000 = **₹13.9 lakh/week**
- Peak monsoon payout (1.2 disrupted days/rider/week): loss ratio ~45%
- Off-season (0.3 days/week): loss ratio ~11%
- **Blended annual loss ratio: ~28%** — commercially sustainable

---

## Parametric Triggers

Five triggers. All objective, all API-verifiable, all tied directly to income loss within a rider's 2km zone. Trigger fires → payout initiates. No claim filing.

| # | Trigger | Exact Threshold | Income Loss Mechanism | Data Source |
|---|---|---|---|---|
| 1 | Hyperlocal Waterlogging | IMD Red Alert (≥64.5mm/day) in rider's district AND ≥1 road within 2km of dark store confirmed flooded | Zone completion rate collapses; rider cannot safely operate | OpenWeatherMap + Google Maps Roads API |
| 2 | Extreme Heat | IMD Heat Wave declared (≥45°C actual max) AND platform completion rate <40% for ≥2 consecutive hours in zone | Riders cannot sustain delivery pace; log off during peak window | OpenWeatherMap + Simulated platform API |
| 3 | Severe AQI | CPCB AQI ≥301 ("Very Poor") in rider's pincode for ≥3 consecutive hours during active shift | Sustained outdoor exposure causes respiratory stress; riders lose 6–10 delivery cycles | AQICN API (free tier) |
| 4 | Zone / Market Closure | Official municipal or police order closing dark store zone or primary delivery zone | Dark store shuts or riders cannot enter/exit zone; zero orders dispatched | Simulated municipal alert API |
| 5 | Platform Outage | Order-assignment system down ≥45 consecutive minutes during 6–10 PM peak window | Rider is active but receives zero orders; peak window = ~40% of daily earnings | Simulated platform status API |

---

## AI/ML Integration Plan

Three models. Each has one job, specific inputs, and a specific output.

### Model 1 — Zone Risk Scoring Engine

**Job:** Score a rider's zone at onboarding → set AI risk loading on weekly premium.
**Algorithm:** XGBoost Regressor — outperforms alternatives on tabular insurance risk data with mixed feature types (Fauzan & Murfi, 2018).
**Inputs (6):** 3-year waterlogging frequency, seasonal AQI score, city tier, zone composite risk score, shift window, prior claim count.
**Output:** Risk score (0–100) → premium adjustment (-₹20 to +₹30). Runs at onboarding, refreshed every 4 weeks.

---

### Model 2 — Fraud Detection Engine

**Job:** Validate every auto-triggered claim before payout. CLEAR → instant payout. FLAG → manual review.
**Algorithm:** Isolation Forest (unsupervised) — chosen because no labeled fraud data exists at launch. Trains on normal behavior; isolates anomalies by path length in random trees.

| Check | Flag Condition |
|---|---|
| GPS zone validation | Last ping outside 2km of registered dark store |
| Activity validation | Rider logged off >30 min before trigger fired |
| Duplicate claim check | Second claim for same trigger type in 7-day window |
| Velocity anomaly | GPS jump >5km in <3 minutes |
| Historical pattern check | Claim in zone with no recorded disruption history for this trigger |

**Output:** CLEAR or FLAG (manual review target: 4 hours). Runs on every triggered claim before payout releases.

---

### Model 3 — Predictive Disruption Forecaster

**Job:** Power the insurer dashboard's 7-day payout liability forecast.
**Algorithm:** LSTM — models temporal sequences (monsoon cycles, AQI spikes) with week-over-week patterns. Falls back to XGBoost regressor if not completed in time.
**Inputs:** 7-day weather + AQI forecast, historical trigger frequency by zone/month, active enrolled riders per zone.
**Output:** Estimated claims + payout liability per zone for next 7 days. Runs every Sunday night.

*All models trained on synthetic data from real IMD/CPCB historical records. In production, Models 1 and 3 retrain quarterly on real claim data. Model 2 updates its anomaly baseline continuously.*

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React.js (PWA + Web Dashboard) | One codebase for both interfaces; largest community; CRA sets up PWA in one command |
| Backend | Python + FastAPI | Beginner-friendly, auto Swagger docs at /docs, async support for trigger polling |
| Database | Firebase Firestore | Zero setup, real-time sync, free tier (50k reads/day), no SQL required |
| Auth | Firebase Auth | OTP-based mobile login, free |
| ML | scikit-learn + xgboost + TensorFlow/Keras | Industry standard, best documentation, beginner accessible |
| Payments | Razorpay (test mode) | Free sandbox, UPI support |
| Hosting | Vercel (frontend) + Render.com (backend) | Both free tier, zero DevOps overhead |

**Total infrastructure cost: ₹0**

### Integrations

| Tool | Purpose | Cost |
|---|---|---|
| OpenWeatherMap | Rainfall, temperature, weather alerts | Free |
| AQICN | Real-time AQI by city/pincode | Free |
| Google Maps / OpenStreetMap | 2km radius zone check, flood layer | Free |
| Razorpay | Payout sandbox | Free |
| React Router | PWA screen navigation | — |
| Recharts | Insurer dashboard analytics charts | — |
| Leaflet.js | Live trigger map with zone overlays | — |
| Axios | Frontend → backend API calls | — |
| Firebase Cloud Messaging | Push notifications to rider PWA | — |

**Simulated in-house (mock FastAPI endpoints):**
- Platform order completion rate by zone
- Platform outage status feed
- Municipal zone closure alert feed

---

## Development Plan

<!-- **Team:** 5 members | **Bandwidth:** 1–2 hours/day | **Estimated total hours:** ~300 -->

### Phase 1 — Ideation & Foundation (Mar 4–20)
Goal: No code. Strategy locked, README written, repo live.

| Task |
|---|
| Finalise persona, triggers, premium model |
| Design application workflow + diagrams |
| Write README.md + set up GitHub repo |
| Learn assigned framework basics |
| Record 2-min strategy video |

<!-- **Submission: README.md + 2-min video → March 20 EOD** -->

---

### Phase 2 — Automation & Protection (Mar 21–Apr 4)
Goal: Working prototype — onboarding, policy, premium, claims.

**Week 3 — Backend + Data Layer**

| Task |
|---|
| FastAPI setup + Firebase Firestore (5 collections) + Auth |
| Rider registration + onboarding API endpoints |
| Synthetic training data generation (IMD/CPCB-based) |
| XGBoost risk model — train + save .pkl + expose via API |
| Policy creation + premium calculation endpoint |

**Week 4 — Frontend + Trigger Engine**

| Task |
|---|
| React PWA — onboarding + policy purchase screens |
| Parametric trigger engine (OpenWeatherMap + AQICN polling) |
| Mock APIs (platform outage + zone closure) |
| Isolation Forest fraud model — train + integrate |
| Razorpay sandbox payout integration |

<!-- **Submission: Working code + 2-min demo video → April 4 EOD** -->

---

### Phase 3 — Scale & Optimise (Apr 5–17)
Goal: Both dashboards complete, end-to-end connected, demo-ready.

**Week 5 — Insurer Dashboard + Advanced Fraud**

| Task |
|---|
| Insurer dashboard — trigger map + claims queue + analytics |
| GPS velocity anomaly check added to fraud engine |
| LSTM forecaster — train + connect to insurer dashboard |
| Rider dashboard — earnings protected + active policy view |

**Week 6 — Integration + Final Polish**

| Task |
|---|
| End-to-end flow test (trigger → fraud → payout) |
| Simulated disruption demo (fake rainstorm trigger) |
| Push notifications via Firebase Cloud Messaging |
| Bug fixes + UI polish across both interfaces |
| 5-min final demo video + pitch deck PDF (8–10 slides) |

<!-- **Submission: Full platform + 5-min video + pitch deck → April 17 EOD** -->

---

## Assumptions & Scope

### Assumptions

| Assumption | Detail |
|---|---|
| Income verification | Self-declared tier cross-checked against platform earnings screenshot. Production uses direct platform API. |
| Geographic scope | Designed for Delhi-NCR, Mumbai, Bengaluru. Tier-2 expansion architecturally supported, not demoed. |
| Working days | Formula uses declared weekly income — riders working fewer than 6 days are not penalised. |
| Platform data | No public APIs exist for completion rates or outage status. Simulated via mock endpoints. |
| Rider GPS | Validation uses last recorded ping at time of trigger — not continuous tracking. Privacy by design. |
| Payout timeline | "Within 2 hours" reflects sandbox behaviour. Real UPI production transfers: typically under 10 minutes. |

### Out of Scope

| Excluded | Reason |
|---|---|
| Vehicle repair / health / accident coverage | Violates constraint — income loss only |
| Monthly or annual pricing | Violates constraint — weekly only |
| Food delivery / e-commerce riders | Outside Q-Commerce persona scope |
| Manual claim filing | Defeats parametric insurance design |
| Continuous GPS tracking | Privacy concern — last-ping validation only |