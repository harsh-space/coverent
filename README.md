# GigShield — Parametric Income Insurance for Q-Commerce Riders

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

**Step 1 — Onboarding (one-time, ~3 minutes)**
Rider opens PWA link → OTP login → selects platform (Zepto/Blinkit/Instamart) → uploads platform ID for income verification → Aadhaar eKYC (OTP-based, no document upload) → registers dark store pincode → enters UPI ID → declares income tier (Low/Mid/High).

**Step 2 — AI Risk Profiling (automatic, ~60 seconds)**
No rider action. System pulls 3-year historical weather + AQI data for the rider's pincode, scores the zone (0–100), and outputs a personalised weekly premium. Rider sees: *"Your zone risk score: 74/100. Recommended plan: Suraksha Plus."*

**Step 3 — Weekly Policy Purchase**
Rider selects plan → pays via UPI in one tap → policy activates Monday 00:00 to Sunday 23:59 → auto-renewal prompt every Sunday evening.

**Step 4 — Parametric Trigger Monitoring (continuous, no rider action)**
GigShield polls OpenWeatherMap every 15 minutes, AQICN every 30 minutes, and simulated platform/municipal APIs continuously. When a trigger condition is met, the engine verifies the rider's policy is active and that the rider was online during the event window.

**Step 5 — Automatic Claim + Fraud Check (automated, <2 minutes)**
Trigger fires → fraud engine runs 3 checks simultaneously (GPS zone validation, duplicate claim check, anomaly pattern check). All pass → auto-approved. Any flag → queued for manual review (target: 4 hours).

**Step 6 — Payout**
Payout calculated → transferred to rider's UPI via Razorpay sandbox → push notification sent → payout logged on rider dashboard. Target: within 2 hours of trigger confirmation.

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

**Resulting premium range:**

| Tier | Low-Risk Zone | High-Risk Zone |
|---|---|---|
| Low | ₹69/week | ₹119/week |
| Mid | ₹119/week | ₹169/week |
| High | ₹159/week | ₹209/week |

*Example: Mid-tier rider in Rohini, Delhi pays ₹169/week. Same tier in Kharadi, Pune pays ₹119/week.*

### Coverage Plans

| Plan | Max Covered Days/Week | Max Payout/Week | Best For |
|---|---|---|---|
| Suraksha Lite | 1 day | ₹700 | Occasional disruptions |
| Suraksha Plus | 2 days | ₹1,400 | Monsoon / AQI season |
| Suraksha Max | 3 days | ₹2,100 | Peak risk months |

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

**Design rationale:**
- **Dual conditions (Triggers 1 & 2):** Prevents false positives — a citywide Red Alert doesn't mean every 2km zone is impassable. Dual conditions make each trigger hyperlocal and fraud-resistant.
- **AQI ≥301:** CPCB's "Very Poor" band is where respiratory effects begin for prolonged outdoor workers. Waiting for ≥401 ("Severe") means riders lose 3–4 earning hours before protection activates.
- **45-minute outage threshold:** Short blips (5–15 min) are routine with no income impact. 45 minutes during peak = 3–4 lost orders = ₹90–₹140 direct loss — the threshold where impact becomes material.

### Payout Per Trigger (Mid-Tier, Suraksha Plus)

| Trigger | Disrupted Days Counted | Estimated Payout |
|---|---|---|
| Waterlogging | 1.0 | ₹630 |
| Extreme Heat | 0.5 | ₹315 |
| Severe AQI | 0.5 | ₹315 |
| Zone Closure | 1.0 | ₹630 |
| Platform Outage | 0.4 | ₹252 |

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

### Key Libraries

| Library | Purpose |
|---|---|
| React Router | Navigation across PWA screens |
| Recharts | Analytics charts on insurer dashboard |
| Leaflet.js | Live trigger map with zone overlays |
| Axios | Frontend → backend API calls |
| Firebase Cloud Messaging | Push notifications to rider PWA |

### External APIs

| API | Purpose | Cost |
|---|---|---|
| OpenWeatherMap | Rainfall, temperature, weather alerts | Free (1,000 calls/day) |
| AQICN | Real-time AQI by city/pincode | Free |
| Google Maps / OpenStreetMap | 2km radius zone check, flood layer | Free tier / fully free |
| Razorpay | Payout sandbox | Free |

**Simulated in-house (mock FastAPI endpoints):**
- Platform order completion rate by zone
- Platform outage status feed
- Municipal zone closure alert feed

### Firebase Collections

| Collection | Stores |
|---|---|
| riders | Profile, income tier, dark store pincode, UPI ID |
| policies | Plan type, premium paid, active week dates |
| triggers | All fired events with timestamps + affected zone |
| claims | Status, fraud check results, payout amount |
| zones | Risk scores, historical disruption data |

---

## Development Plan

**Team:** 5 members | **Bandwidth:** 1–2 hours/day | **Estimated total hours:** ~300

### Phase 1 — Ideation & Foundation (Mar 4–20)
Goal: No code. Strategy locked, README written, repo live.

| Task | Owner |
|---|---|
| Finalise persona, triggers, premium model | All 5 |
| Design application workflow + diagrams | All 5 |
| Write README.md + set up GitHub repo | Person 5 + 3 |
| Learn assigned framework basics | Each individually |
| Record 2-min strategy video | Person 5 |

**Submission: README.md + 2-min video → March 20 EOD**

---

### Phase 2 — Automation & Protection (Mar 21–Apr 4)
Goal: Working prototype — onboarding, policy, premium, claims.

**Week 3 — Backend + Data Layer**

| Task | Owner |
|---|---|
| FastAPI setup + Firebase Firestore (5 collections) + Auth | Person 3 |
| Rider registration + onboarding API endpoints | Person 3 |
| Synthetic training data generation (IMD/CPCB-based) | Person 4 |
| XGBoost risk model — train + save .pkl + expose via API | Person 4 |
| Policy creation + premium calculation endpoint | Person 3 + 4 |

**Week 4 — Frontend + Trigger Engine**

| Task | Owner |
|---|---|
| React PWA — onboarding + policy purchase screens | Person 1 |
| Parametric trigger engine (OpenWeatherMap + AQICN polling) | Person 4 |
| Mock APIs (platform outage + zone closure) | Person 5 |
| Isolation Forest fraud model — train + integrate | Person 4 |
| Razorpay sandbox payout integration | Person 3 |

**Submission: Working code + 2-min demo video → April 4 EOD**

---

### Phase 3 — Scale & Optimise (Apr 5–17)
Goal: Both dashboards complete, end-to-end connected, demo-ready.

**Week 5 — Insurer Dashboard + Advanced Fraud**

| Task | Owner |
|---|---|
| Insurer dashboard — trigger map + claims queue + analytics | Person 2 |
| GPS velocity anomaly check added to fraud engine | Person 4 |
| LSTM forecaster — train + connect to insurer dashboard | Person 4 |
| Rider dashboard — earnings protected + active policy view | Person 1 |

**Week 6 — Integration + Final Polish**

| Task | Owner |
|---|---|
| End-to-end flow test (trigger → fraud → payout) | Person 3 + 5 |
| Simulated disruption demo (fake rainstorm trigger) | Person 5 |
| Push notifications via Firebase Cloud Messaging | Person 1 |
| Bug fixes + UI polish across both interfaces | All 5 |
| 5-min final demo video + pitch deck PDF (8–10 slides) | Person 5 |

**Submission: Full platform + 5-min video + pitch deck → April 17 EOD**

---

### Risk Buffer

| Risk | Mitigation |
|---|---|
| LSTM too complex to finish in time | Fall back to XGBoost regressor — same output, simpler build |
| Razorpay integration delayed | Hardcoded mock payout response — acceptable for demo |
| Team bandwidth drops during exams | Person 5 handles integration; models already trained by Week 4 |

### What Gets Demoed vs Simulated

| Component | Status |
|---|---|
| Rider onboarding + OTP | ✅ Fully working |
| AI risk scoring + premium display | ✅ Fully working |
| Weekly policy purchase | ✅ Fully working (Razorpay sandbox) |
| Parametric trigger engine | ✅ Working (real APIs + mock APIs) |
| Fraud detection | ✅ Working (Isolation Forest) |
| Auto payout | ✅ Working (Razorpay sandbox) |
| Insurer dashboard | ✅ Fully working |
| LSTM forecast widget | ⚠️ Working on synthetic data |
| Municipal closure alert | ⚠️ Simulated mock API |
| Platform outage detection | ⚠️ Simulated mock API |

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

### Out of Scope (By Design)

| Excluded | Reason |
|---|---|
| Vehicle repair / health / accident coverage | Violates constraint — income loss only |
| Monthly or annual pricing | Violates constraint — weekly only |
| Food delivery / e-commerce riders | Outside Q-Commerce persona scope |
| Manual claim filing | Defeats parametric insurance design |
| Continuous GPS tracking | Privacy concern — last-ping validation only |

### Future Scope

- Direct platform API integration replacing all mock endpoints
- IRDAI regulatory compliance framework for commercial launch
- Expansion to food delivery and e-commerce personas
- Regional language support (Hindi, Tamil, Telugu) on rider PWA
- Aadhaar-based income verification via DigiLocker API
