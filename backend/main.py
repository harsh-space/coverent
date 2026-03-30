from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database import db

load_dotenv()

app = FastAPI(
    title="GigShield API",
    description="Parametric insurance platform for Q-Commerce delivery workers",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "GigShield API is running"}

@app.get("/health")
def health():
    # Test Firebase connection
    try:
        db.collection("health").document("ping").set({"ping": "pong"})
        return {"status": "ok", "firebase": "connected"}
    except Exception as e:
        return {"status": "ok", "firebase": f"error: {str(e)}"}