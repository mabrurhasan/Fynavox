import type { Patient, Vitals } from "./types";
import { computeRisk, getStatusFromRisk } from "./patients";

export const ALERT_SEQUENCE = {
  heartRate: [78, 88, 101, 118, 128],
  spo2: [98, 96, 94, 91, 88],
  temperature: [36.7, 37.3, 38.0, 38.6],
};

function pushHistory(arr: number[], value: number, max = 12): number[] {
  return [...arr.slice(-(max - 1)), value];
}

export function simulatePatientTick(patient: Patient): Patient {
  const jitter = () => (Math.random() - 0.5) * 2;

  let hr = patient.vitals.heartRate + jitter();
  let spo2 = patient.vitals.spo2 + jitter() * 0.3;
  let temp = patient.vitals.temperature + jitter() * 0.05;

  if (patient.id === "C") {
    hr = Math.min(135, hr + Math.random() * 2);
    spo2 = Math.max(85, spo2 - Math.random() * 0.5);
    temp = Math.min(39, temp + Math.random() * 0.05);
  } else if (patient.id === "A") {
    hr = 76 + Math.random() * 6;
    spo2 = 97 + Math.random() * 2;
    temp = 36.5 + Math.random() * 0.4;
  } else if (patient.id === "B") {
    hr = 82 + Math.random() * 8;
    spo2 = 94 + Math.random() * 3;
    temp = 37 + Math.random() * 0.5;
  } else {
    hr = Math.max(55, Math.min(110, hr));
    spo2 = Math.max(90, Math.min(100, spo2));
    temp = Math.max(36, Math.min(38.5, temp));
  }

  const vitals: Vitals = {
    heartRate: Math.round(hr),
    spo2: Math.round(spo2 * 10) / 10,
    temperature: Math.round(temp * 10) / 10,
  };

  const riskScore = computeRisk(vitals);
  const status = getStatusFromRisk(riskScore);

  return {
    ...patient,
    vitals,
    riskScore,
    status,
    history: {
      heartRate: pushHistory(patient.history.heartRate, vitals.heartRate),
      spo2: pushHistory(patient.history.spo2, vitals.spo2),
      temperature: pushHistory(
        patient.history.temperature,
        vitals.temperature
      ),
      risk: pushHistory(patient.history.risk, riskScore),
    },
  };
}

let alertStepIndex = 0;

export function getAlertSequenceVitals(): Vitals | null {
  if (alertStepIndex >= ALERT_SEQUENCE.heartRate.length) return null;
  const vitals: Vitals = {
    heartRate: ALERT_SEQUENCE.heartRate[alertStepIndex],
    spo2: ALERT_SEQUENCE.spo2[alertStepIndex],
    temperature: ALERT_SEQUENCE.temperature[alertStepIndex],
  };
  alertStepIndex++;
  return vitals;
}

export function resetAlertSequence(): void {
  alertStepIndex = 0;
}

export function applyVitalsToPatient(
  patient: Patient,
  vitals: Vitals
): Patient {
  const riskScore = computeRisk(vitals);
  return {
    ...patient,
    vitals,
    riskScore,
    status: getStatusFromRisk(riskScore),
    history: {
      heartRate: pushHistory(patient.history.heartRate, vitals.heartRate),
      spo2: pushHistory(patient.history.spo2, vitals.spo2),
      temperature: pushHistory(
        patient.history.temperature,
        vitals.temperature
      ),
      risk: pushHistory(patient.history.risk, riskScore),
    },
  };
}
