import json
import os
import firebase_admin
from firebase_admin import credentials
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import FIREBASE_CREDENTIALS_PATH
from app.routes import riders, platforms, triggers

# Initialize Firebase via Service Account (File or Environment Variable)
firebase_creds_json = os.getenv("FIREBASE_SERVICE_ACCOUNT")
if firebase_creds_json:
    try:
        # Load directly from environment variable string
        creds_dict = json.loads(firebase_creds_json)
        cred = credentials.Certificate(creds_dict)
    except Exception as e:
        print(f"Error parsing FIREBASE_SERVICE_ACCOUNT: {e}")
        cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
else:
    # Use local file path (fallback)
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)

firebase_admin.initialize_app(cred)

app = FastAPI(
    title="Coverent API",
    description="Parametric income insurance for Q-Commerce riders",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Register routers
app.include_router(riders.router)
app.include_router(platforms.router)
app.include_router(triggers.router)

@app.get("/")
def health_check():
    return {"status":"ok"}