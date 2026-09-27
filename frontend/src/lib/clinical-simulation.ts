export type SimulationStage = 1 | 2 | 3 | 4 | 5;

export type SimulationStatus = "stable" | "observation" | "critical";

export interface SimulationVitals {
  heartRate: number;
  spo2: number;
  temperature: number;
  respiratoryRate: number;
  bloodPressure: string;
}

export interface SimulationState {
  stage: SimulationStage;
  elapsedMs: number;
  progress: number;
  vitals: SimulationVitals;
  riskScore: number;
  status: SimulationStatus;
  statusLabel: string;
  showAlert: boolean;
  showWorkflow: boolean;
  showSummary: boolean;
}

export const SIMULATION_DURATION_MS = 25_000;

export const PATIENT = {
  name: "Rahul Sharma",
  age: 54,
  room: "ICU-07",
  bed: "B-12",
  condition: "Post-operative monitoring",
};

const KEYFRAMES = {
  t0: {
    heartRate: 78,
    spo2: 98,
    temperature: 36.7,
    respiratoryRate: 16,
    bloodPressure: "118/78",
    riskScore: 12,
  },
  t5: {
    heartRate: 92,
    spo2: 94,
    temperature: 37.2,
    respiratoryRate: 18,
    bloodPressure: "118/78",
    riskScore: 36,
  },
  t10: {
    heartRate: 92,
    spo2: 94,
    temperature: 37.2,
    respiratoryRate: 18,
    bloodPressure: "120/80",
    riskScore: 36,
  },
  t15: {
    heartRate: 124,
    spo2: 88,
    temperature: 38.5,
    respiratoryRate: 24,
    bloodPressure: "128/86",
    riskScore: 91,
  },
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

function interpolateVitals(
  from: typeof KEYFRAMES.t0,
  to: typeof KEYFRAMES.t0,
  t: number
): SimulationVitals {
  const u = clamp01(t);
  return {
    heartRate: Math.round(lerp(from.heartRate, to.heartRate, u)),
    spo2: Math.round(lerp(from.spo2, to.spo2, u) * 10) / 10,
    temperature: Math.round(lerp(from.temperature, to.temperature, u) * 10) / 10,
    respiratoryRate: Math.round(
      lerp(from.respiratoryRate, to.respiratoryRate, u)
    ),
    bloodPressure: to.bloodPressure,
  };
}

function riskFromVitals(v: SimulationVitals): number {
  let risk = 10;
  if (v.heartRate > 100) risk += (v.heartRate - 100) * 1.1;
  if (v.spo2 < 95) risk += (95 - v.spo2) * 4;
  if (v.temperature > 37.5) risk += (v.temperature - 37.5) * 14;
  if (v.respiratoryRate > 20) risk += (v.respiratoryRate - 20) * 2;
  return Math.min(100, Math.max(0, Math.round(risk)));
}

function statusFromRisk(risk: number): {
  status: SimulationStatus;
  label: string;
} {
  if (risk >= 70) return { status: "critical", label: "Critical" };
  if (risk >= 30) return { status: "observation", label: "Observation Required" };
  return { status: "stable", label: "Stable" };
}

export function getSimulationState(elapsedMs: number): SimulationState {
  const progress = Math.min(1, elapsedMs / SIMULATION_DURATION_MS);
  let vitals: SimulationVitals;
  let riskScore: number;
  let stage: SimulationStage;

  if (elapsedMs < 5000) {
    stage = 1;
    vitals = {
      heartRate: KEYFRAMES.t0.heartRate,
      spo2: KEYFRAMES.t0.spo2,
      temperature: KEYFRAMES.t0.temperature,
      respiratoryRate: KEYFRAMES.t0.respiratoryRate,
      bloodPressure: KEYFRAMES.t0.bloodPressure,
    };
    riskScore = KEYFRAMES.t0.riskScore;
  } else if (elapsedMs < 10000) {
    stage = 2;
    const t = (elapsedMs - 5000) / 5000;
    const v = interpolateVitals(KEYFRAMES.t0, KEYFRAMES.t5, t);
    vitals = v;
    riskScore = Math.round(lerp(12, 36, t));
  } else if (elapsedMs < 15000) {
    stage = 3;
    const t = (elapsedMs - 10000) / 5000;
    const v = interpolateVitals(KEYFRAMES.t10, KEYFRAMES.t15, t);
    vitals = v;
    riskScore = Math.round(lerp(36, 91, t));
  } else {
    stage = elapsedMs < 20000 ? 4 : 5;
    vitals = {
      heartRate: KEYFRAMES.t15.heartRate,
      spo2: KEYFRAMES.t15.spo2,
      temperature: KEYFRAMES.t15.temperature,
      respiratoryRate: KEYFRAMES.t15.respiratoryRate,
      bloodPressure: KEYFRAMES.t15.bloodPressure,
    };
    riskScore = KEYFRAMES.t15.riskScore;
  }

  if (stage >= 3) {
    riskScore = Math.max(riskScore, riskFromVitals(vitals));
  }

  const { status, label } = statusFromRisk(riskScore);

  return {
    stage,
    elapsedMs,
    progress,
    vitals,
    riskScore,
    status,
    statusLabel: label,
    showAlert: elapsedMs >= 12000,
    showWorkflow: elapsedMs >= 15000 && elapsedMs < 20000,
    showSummary: elapsedMs >= 20000,
  };
}

export const ACTIVITY_LOG = [
  { time: "09:41:32", message: "Alert generated" },
  { time: "09:41:35", message: "Nurse acknowledged" },
  { time: "09:41:39", message: "Doctor reviewing patient" },
  { time: "09:41:42", message: "Emergency response initiated" },
];

export type AIPanelMode =
  | "monitoring"
  | "trend"
  | "analysis"
  | "idle";

export function getAIPanelContent(stage: SimulationStage): {
  title: string;
  steps: string[];
  detected?: string[];
  condition?: string;
  confidence?: number;
  actions?: string[];
} {
  switch (stage) {
    case 1:
      return {
        title: "AI Monitoring Active",
        steps: [
          "Collecting live vital trends",
          "Monitoring abnormalities",
          "Risk analysis running",
        ],
      };
    case 2:
      return {
        title: "Trend Analysis",
        steps: [
          "Small oxygen decline detected",
          "Elevated heart rate trend detected",
          "Continued observation recommended",
        ],
      };
    case 3:
    case 4:
      return {
        title: "Risk Analysis Completed",
        steps: [],
        detected: [
          "Rapid oxygen decline",
          "Elevated heart rate trend",
          "Increased respiratory rate",
        ],
        condition: "Potential respiratory deterioration",
        confidence: 91,
        actions: [
          "Notify assigned nurse",
          "Reassess patient condition",
          "Escalate if deterioration continues",
        ],
      };
    default:
      return {
        title: "Simulation Complete",
        steps: ["Clinical workflow documented"],
      };
  }
}

export const STAGE_LABELS: Record<SimulationStage, string> = {
  1: "Initial monitoring",
  2: "Early trend change",
  3: "Deterioration detection",
  4: "Clinical response workflow",
  5: "Clinical summary",
};
