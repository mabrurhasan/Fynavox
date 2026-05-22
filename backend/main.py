"""
FynavoX Backend API
FastAPI + WebSocket real-time patient monitoring simulation
"""

import asyncio
import json
import random
from datetime import datetime
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="FynavoX API",
    description="Healthcare intelligence platform — real-time monitoring",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def compute_risk(hr: float, spo2: float, temp: float) -> int:
    risk = 10.0
    if hr > 100:
        risk += (hr - 100) * 1.2
    if hr < 55:
        risk += (55 - hr) * 1.5
    if spo2 < 95:
        risk += (95 - spo2) * 4
    if temp > 37.5:
        risk += (temp - 37.5) * 15
    if temp < 36:
        risk += (36 - temp) * 10
    return min(100, max(0, int(round(risk))))


def status_from_risk(risk: int) -> str:
    if risk >= 70:
        return "critical"
    if risk >= 40:
        return "moderate"
    return "normal"


INITIAL_PATIENTS = [
    {
        "id": "A",
        "name": "James Mitchell",
        "age": 67,
        "room": "ICU-204",
        "bed": "B-12",
        "vitals": {"heartRate": 78, "spo2": 98.0, "temperature": 36.7},
        "riskScore": 18,
        "status": "normal",
    },
    {
        "id": "B",
        "name": "Sarah Chen",
        "age": 54,
        "room": "Ward-118",
        "bed": "B-04",
        "vitals": {"heartRate": 85, "spo2": 96.0, "temperature": 37.2},
        "riskScore": 42,
        "status": "moderate",
    },
    {
        "id": "C",
        "name": "Robert Hayes",
        "age": 72,
        "room": "ICU-201",
        "bed": "B-01",
        "vitals": {"heartRate": 122, "spo2": 89.0, "temperature": 38.5},
        "riskScore": 87,
        "status": "critical",
    },
    {
        "id": "D",
        "name": "Maria Lopez",
        "age": 61,
        "room": "Ward-105",
        "bed": "B-08",
        "vitals": {"heartRate": 72, "spo2": 97.0, "temperature": 36.5},
        "riskScore": 22,
        "status": "normal",
    },
    {
        "id": "E",
        "name": "David Kim",
        "age": 48,
        "room": "ER-302",
        "bed": "B-02",
        "vitals": {"heartRate": 94, "spo2": 94.0, "temperature": 37.8},
        "riskScore": 58,
        "status": "moderate",
    },
    {
        "id": "F",
        "name": "Emily Watson",
        "age": 39,
        "room": "Ward-112",
        "bed": "B-06",
        "vitals": {"heartRate": 68, "spo2": 99.0, "temperature": 36.4},
        "riskScore": 12,
        "status": "normal",
    },
]

patient_state: list[dict[str, Any]] = [
    {**p, "history": {"heartRate": [], "spo2": [], "temperature": [], "risk": []}}
    for p in INITIAL_PATIENTS
]

for p in patient_state:
    v = p["vitals"]
    for _ in range(12):
        p["history"]["heartRate"].append(v["heartRate"])
        p["history"]["spo2"].append(v["spo2"])
        p["history"]["temperature"].append(v["temperature"])
        p["history"]["risk"].append(p["riskScore"])


def tick_patient(p: dict) -> dict:
    v = p["vitals"]
    jitter = lambda: (random.random() - 0.5) * 2

    hr = v["heartRate"] + jitter()
    spo2 = v["spo2"] + jitter() * 0.3
    temp = v["temperature"] + jitter() * 0.05

    if p["id"] == "C":
        hr = min(135, hr + random.random() * 2)
        spo2 = max(85, spo2 - random.random() * 0.5)
        temp = min(39, temp + random.random() * 0.05)
    elif p["id"] == "A":
        hr = 76 + random.random() * 6
        spo2 = 97 + random.random() * 2
        temp = 36.5 + random.random() * 0.4
    elif p["id"] == "B":
        hr = 82 + random.random() * 8
        spo2 = 94 + random.random() * 3
        temp = 37 + random.random() * 0.5
    else:
        hr = max(55, min(110, hr))
        spo2 = max(90, min(100, spo2))
        temp = max(36, min(38.5, temp))

    vitals = {
        "heartRate": int(round(hr)),
        "spo2": round(spo2, 1),
        "temperature": round(temp, 1),
    }
    risk = compute_risk(vitals["heartRate"], vitals["spo2"], vitals["temperature"])

    def push(arr: list, val: float | int) -> list:
        return (arr + [val])[-12:]

    return {
        **p,
        "vitals": vitals,
        "riskScore": risk,
        "status": status_from_risk(risk),
        "history": {
            "heartRate": push(p["history"]["heartRate"], vitals["heartRate"]),
            "spo2": push(p["history"]["spo2"], vitals["spo2"]),
            "temperature": push(p["history"]["temperature"], vitals["temperature"]),
            "risk": push(p["history"]["risk"], risk),
        },
    }


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str


@app.get("/")
async def root():
    return {"service": "FynavoX API", "status": "operational"}


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat(),
        version="1.0.0",
    )


@app.get("/api/patients")
async def get_patients():
    return {"patients": patient_state, "timestamp": datetime.utcnow().isoformat()}


@app.post("/api/predict-risk")
async def predict_risk(heart_rate: float, spo2: float, temperature: float):
    """Risk endpoint — scikit-learn classifier with rule-based fallback."""
    try:
        from ml.risk_model import predict_status

        result = predict_status(heart_rate, spo2, temperature)
        result["ruleRiskScore"] = compute_risk(heart_rate, spo2, temperature)
        return result
    except Exception:
        risk = compute_risk(heart_rate, spo2, temperature)
        return {
            "riskScore": risk,
            "status": status_from_risk(risk),
            "model": "fynavox-risk-v2.1-rules",
            "features": [heart_rate, spo2, temperature],
        }


@app.websocket("/ws/patients")
async def websocket_patients(websocket: WebSocket):
    await websocket.accept()
    global patient_state
    try:
        while True:
            patient_state = [tick_patient(p) for p in patient_state]
            await websocket.send_json(
                {
                    "patients": patient_state,
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )
            await asyncio.sleep(1.5)
    except WebSocketDisconnect:
        pass


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
