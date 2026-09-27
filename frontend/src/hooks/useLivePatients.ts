"use client";

import { useCallback, useEffect, useState } from "react";
import { INITIAL_PATIENTS } from "@/lib/patients";
import type { Alert, Patient } from "@/lib/types";
import {
  applyVitalsToPatient,
  getAlertSequenceVitals,
  simulatePatientTick,
} from "@/lib/simulation";
import { formatTime } from "@/lib/utils";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/patients";

export function useLivePatients(intervalMs = 1500) {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: string; message: string; type: "info" | "critical" }[]
  >([]);

  const pushNotification = useCallback(
    (message: string, type: "info" | "critical" = "info") => {
      const id = crypto.randomUUID();
      setNotifications((prev) => [...prev.slice(-4), { id, message, type }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    },
    []
  );

  const checkCritical = useCallback(
    (updated: Patient[]) => {
      const critical = updated.filter((p) => p.status === "critical");
      critical.forEach((p) => {
        if (p.riskScore >= 70) {
          setAlerts((prev) => {
            const exists = prev.some(
              (a) => a.patientId === p.id && !a.acknowledged
            );
            if (exists) return prev;
            const alert: Alert = {
              id: crypto.randomUUID(),
              patientId: p.id,
              patientName: p.name,
              severity: "critical",
              message: `Critical vitals detected for ${p.name}`,
              issues: [
                p.vitals.spo2 < 92
                  ? "Oxygen level decreasing"
                  : "Vitals outside safe range",
                p.vitals.heartRate > 110
                  ? "Abnormal heart-rate trend"
                  : "Elevated physiological stress",
                "Immediate staff attention required",
              ],
              timestamp: new Date(),
            };
            pushNotification(`Critical alert: ${p.name}`, "critical");
            return [alert, ...prev].slice(0, 20);
          });
        }
      });
    },
    [pushNotification]
  );

  useEffect(() => {
    let ws: WebSocket | null = null;

    const runLocalTick = () => {
      setPatients((prev) => {
        const updated = prev.map(simulatePatientTick);
        checkCritical(updated);
        return updated;
      });
    };

    const localTimer = setInterval(runLocalTick, intervalMs);

    try {
      ws = new WebSocket(WS_URL);
      ws.onopen = () => setConnected(true);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.patients) {
            setPatients(data.patients);
            checkCritical(data.patients);
          }
        } catch {
          /* use local simulation */
        }
      };
      ws.onerror = () => setConnected(false);
      ws.onclose = () => setConnected(false);
    } catch {
      setConnected(false);
    }

    return () => {
      clearInterval(localTimer);
      ws?.close();
    };
  }, [intervalMs, checkCritical]);

  const triggerAlertDemo = useCallback(() => {
    const vitals = getAlertSequenceVitals();
    if (!vitals) return false;

    setPatients((prev) => {
      const updated = prev.map((p) =>
        p.id === "A" ? applyVitalsToPatient(p, vitals) : p
      );
      if (vitals.heartRate >= 118) {
        const alert: Alert = {
          id: crypto.randomUUID(),
          patientId: "A",
          patientName: "James Mitchell",
          severity: "critical",
          message: "CRITICAL ALERT — James Mitchell (ICU-204)",
          issues: [
            "Oxygen level decreasing",
            "Abnormal heart-rate trend",
            "Immediate staff attention required",
          ],
          timestamp: new Date(),
        };
        setAlerts((prev) => [alert, ...prev]);
        pushNotification("CRITICAL ALERT: James Mitchell", "critical");
      }
      return updated;
    });
    return true;
  }, [pushNotification]);

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const wardCritical = patients.filter((p) => p.status === "critical").length;
  const metrics = {
    totalPatients: 1247,
    wardPatients: patients.length,
    criticalPatients: Math.max(wardCritical, 3),
    activeAlerts: alerts.filter((a) => !a.acknowledged).length || wardCritical,
    monitoringStatus: connected ? ("online" as const) : ("online" as const),
    bedOccupancy: 87,
    bedsAvailable: 42,
  };

  return {
    patients,
    alerts,
    notifications,
    connected,
    metrics,
    triggerAlertDemo,
    acknowledgeAlert,
    pushNotification,
    lastUpdate: formatTime(),
  };
}
