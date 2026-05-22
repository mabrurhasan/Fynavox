"""
FynavoX risk scoring — scikit-learn integration point.

Trains a lightweight classifier on synthetic vitals for demo inference.
Production: replace with hospital-labeled dataset and TensorFlow pipeline.
"""

from __future__ import annotations

import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

FEATURE_NAMES = ["heart_rate", "spo2", "temperature"]

_model: GradientBoostingClassifier | None = None


def _synthetic_training_data(n: int = 500) -> tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(42)
    X = np.column_stack(
        [
            rng.integers(55, 140, n),
            rng.uniform(85, 100, n),
            rng.uniform(35.5, 39.5, n),
        ]
    )
    y = np.zeros(n, dtype=int)
    for i in range(n):
        hr, spo2, temp = X[i]
        risk = 10.0
        if hr > 100:
            risk += (hr - 100) * 1.2
        if spo2 < 95:
            risk += (95 - spo2) * 4
        if temp > 37.5:
            risk += (temp - 37.5) * 15
        if risk >= 70:
            y[i] = 2
        elif risk >= 40:
            y[i] = 1
    return X, y


def get_model() -> GradientBoostingClassifier:
    global _model
    if _model is None:
        X, y = _synthetic_training_data()
        _model = GradientBoostingClassifier(
            n_estimators=50, max_depth=3, random_state=42
        )
        _model.fit(X, y)
    return _model


def predict_status(heart_rate: float, spo2: float, temperature: float) -> dict:
    model = get_model()
    X = np.array([[heart_rate, spo2, temperature]])
    proba = model.predict_proba(X)[0]
    label = int(model.predict(X)[0])
    status_map = {0: "normal", 1: "moderate", 2: "critical"}
    risk_map = {0: 25, 1: 55, 2: 85}
    return {
        "status": status_map.get(label, "normal"),
        "riskScore": risk_map.get(label, 25),
        "confidence": float(max(proba)),
        "model": "fynavox-gb-v2.1-sklearn",
        "features": dict(zip(FEATURE_NAMES, [heart_rate, spo2, temperature])),
    }
