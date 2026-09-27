import type { Patient } from "./types";

const history = (base: number, variance: number, len = 12) =>
  Array.from({ length: len }, (_, i) =>
    Math.round((base + Math.sin(i * 0.5) * variance) * 10) / 10
  );

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "A",
    name: "James Mitchell",
    age: 67,
    room: "ICU-204",
    bed: "B-12",
    vitals: { heartRate: 78, spo2: 98, temperature: 36.7 },
    riskScore: 18,
    status: "normal",
    history: {
      heartRate: history(78, 3),
      spo2: history(98, 0.5),
      temperature: history(36.7, 0.2),
      risk: history(18, 4),
    },
  },
  {
    id: "B",
    name: "Sarah Chen",
    age: 54,
    room: "Ward-118",
    bed: "B-04",
    vitals: { heartRate: 85, spo2: 96, temperature: 37.2 },
    riskScore: 42,
    status: "moderate",
    history: {
      heartRate: history(85, 5),
      spo2: history(96, 1),
      temperature: history(37.2, 0.3),
      risk: history(42, 6),
    },
  },
  {
    id: "C",
    name: "Robert Hayes",
    age: 72,
    room: "ICU-201",
    bed: "B-01",
    vitals: { heartRate: 122, spo2: 89, temperature: 38.5 },
    riskScore: 87,
    status: "critical",
    history: {
      heartRate: history(122, 8),
      spo2: history(89, 2),
      temperature: history(38.5, 0.4),
      risk: history(87, 5),
    },
  },
  {
    id: "D",
    name: "Maria Lopez",
    age: 61,
    room: "Ward-105",
    bed: "B-08",
    vitals: { heartRate: 72, spo2: 97, temperature: 36.5 },
    riskScore: 22,
    status: "normal",
    history: {
      heartRate: history(72, 2),
      spo2: history(97, 0.5),
      temperature: history(36.5, 0.2),
      risk: history(22, 3),
    },
  },
  {
    id: "E",
    name: "David Kim",
    age: 48,
    room: "ER-302",
    bed: "B-02",
    vitals: { heartRate: 94, spo2: 94, temperature: 37.8 },
    riskScore: 58,
    status: "moderate",
    history: {
      heartRate: history(94, 6),
      spo2: history(94, 1.5),
      temperature: history(37.8, 0.3),
      risk: history(58, 7),
    },
  },
  {
    id: "F",
    name: "Emily Watson",
    age: 39,
    room: "Ward-112",
    bed: "B-06",
    vitals: { heartRate: 68, spo2: 99, temperature: 36.4 },
    riskScore: 12,
    status: "normal",
    history: {
      heartRate: history(68, 2),
      spo2: history(99, 0.3),
      temperature: history(36.4, 0.1),
      risk: history(12, 2),
    },
  },
];

export function getStatusFromRisk(risk: number): Patient["status"] {
  if (risk >= 70) return "critical";
  if (risk >= 40) return "moderate";
  return "normal";
}

export function computeRisk(vitals: {
  heartRate: number;
  spo2: number;
  temperature: number;
}): number {
  let risk = 10;
  if (vitals.heartRate > 100) risk += (vitals.heartRate - 100) * 1.2;
  if (vitals.heartRate < 55) risk += (55 - vitals.heartRate) * 1.5;
  if (vitals.spo2 < 95) risk += (95 - vitals.spo2) * 4;
  if (vitals.temperature > 37.5) risk += (vitals.temperature - 37.5) * 15;
  if (vitals.temperature < 36) risk += (36 - vitals.temperature) * 10;
  return Math.min(100, Math.max(0, Math.round(risk)));
}
