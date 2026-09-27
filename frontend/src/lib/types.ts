export type PatientStatus = "normal" | "moderate" | "critical";

export type UserRole = "doctor" | "nurse" | "admin";

export interface Vitals {
  heartRate: number;
  spo2: number;
  temperature: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  room: string;
  bed: string;
  vitals: Vitals;
  riskScore: number;
  status: PatientStatus;
  history: {
    heartRate: number[];
    spo2: number[];
    temperature: number[];
    risk: number[];
  };
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  severity: "warning" | "critical";
  message: string;
  issues: string[];
  timestamp: Date;
  acknowledged?: boolean;
}

export interface DashboardMetrics {
  totalPatients: number;
  criticalPatients: number;
  activeAlerts: number;
  monitoringStatus: "online" | "degraded" | "offline";
  bedOccupancy: number;
}

export interface ActivityItem {
  id: string;
  type: "alert" | "vitals" | "ai" | "staff";
  message: string;
  time: string;
}

export interface AIProcessingStep {
  id: string;
  label: string;
  completed: boolean;
  active: boolean;
}
