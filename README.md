# FynavoX

**Predict. Protect. Respond.**

AI-powered healthcare intelligence platform for real-time patient monitoring and early risk detection. Investor-ready interactive prototype built for hospital pilot deployment presentations.

## Quick Start

### Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend (FastAPI + WebSockets)

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python main.py
```

API: [http://localhost:8000](http://localhost:8000)  
WebSocket: `ws://localhost:8000/ws/patients`

## Demo Flow (Recommended for Presentations)

1. **Impact Screen** (`/`) — Animated metrics, CTAs
2. **Sign In** (`/auth`) — Select Doctor / Nurse / Admin
3. **Command Center** (`/dashboard`) — Live monitoring overview
4. **Live Clinical Simulation** (`/simulation`) — 25s ICU deterioration demo (recommended for pitches)
5. **Patient Monitoring** (`/patients`) — Vitals, charts, risk gauges
6. **AI Engine** (`/ai-engine`) — Live processing pipeline
7. **Smart Alerts** (`/alerts`) — Click **Run Alert Simulation** for critical escalation
8. **Analytics** (`/analytics`) — Charts and prediction insights
9. **Business Impact** (`/impact`) — Problems solved & revenue model

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Next.js 15, Tailwind CSS, Recharts, Framer Motion |
| Backend | FastAPI, WebSockets |
| Database | Firebase (config placeholder) |
| AI | Python, Scikit-learn (risk endpoint), TensorFlow (roadmap) |
| Deploy | Vercel (frontend), Render (backend) |

## Project Structure

```
FynavoX/
├── frontend/          # Next.js app
│   └── src/
│       ├── app/       # Pages (8 screens)
│       ├── components/
│       ├── context/   # Live patient state
│       ├── hooks/
│       └── lib/       # Simulation & types
└── backend/           # FastAPI + WebSocket server
    ├── main.py
    └── firebase_config.py
```

## Deployment

### Vercel (Frontend)

1. Import `frontend` directory
2. Set `NEXT_PUBLIC_WS_URL` to your Render WebSocket URL (`wss://...`)

### Render (Backend)

1. Create Web Service from `backend`
2. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Features

- Live patient vitals (1–2s updates)
- Heartbeat pulse animation, risk gauge, chart animations
- Sliding notification toasts, critical alert pulsing
- Role-based auth (demo)
- Alert simulation: HR 78→128, SpO₂ 98→88, Temp 36.7→38.6
- Enterprise healthcare SaaS UI (white, medical blue, navy)

---

© 2026 FynavoX Healthcare Intelligence · Pilot Prototype
