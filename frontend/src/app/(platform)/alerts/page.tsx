"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Phone,
  Siren,
  Stethoscope,
} from "lucide-react";
import { useLivePatientsContext } from "@/context/LivePatientsContext";
import { resetAlertSequence } from "@/lib/simulation";
import { ALERT_SEQUENCE } from "@/lib/simulation";

export default function AlertsPage() {
  const { alerts, triggerAlertDemo, acknowledgeAlert, pushNotification } =
    useLivePatientsContext();
  const [demoStep, setDemoStep] = useState(0);
  const [showCritical, setShowCritical] = useState(false);
  const [actions, setActions] = useState<string[]>([]);

  const runDemo = () => {
    resetAlertSequence();
    setDemoStep(0);
    setShowCritical(false);
    setActions([]);

    let step = 0;
    const interval = setInterval(() => {
      const hasMore = triggerAlertDemo();
      step++;
      setDemoStep(step);
      if (!hasMore || step >= ALERT_SEQUENCE.heartRate.length) {
        clearInterval(interval);
        if (step >= ALERT_SEQUENCE.heartRate.length) {
          setShowCritical(true);
        }
      }
    }, 1200);
  };

  const handleAction = (action: string) => {
    setActions((prev) => [...prev, action]);
    pushNotification(`${action} — dispatched`, "info");
  };

  const latestCritical = alerts.find(
    (a) => a.severity === "critical" && !a.acknowledged
  );

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Smart Alert System</h1>
          <p className="text-sm text-slate-500">
            Automated vitals escalation · Clinical response workflow
          </p>
        </div>
        <button
          onClick={runDemo}
          className="rounded-lg bg-medical-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-medical-700"
        >
          Run Alert Simulation
        </button>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="mb-4 font-semibold text-navy-900">Simulation Sequence</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-slate-600">Heart Rate</p>
              <p className="font-mono text-navy-900">
                {ALERT_SEQUENCE.heartRate.join(" → ")} BPM
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full bg-red-500"
                  animate={{
                    width: `${(demoStep / ALERT_SEQUENCE.heartRate.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <p className="font-medium text-slate-600">SpO₂</p>
              <p className="font-mono text-navy-900">
                {ALERT_SEQUENCE.spo2.join(" → ")}%
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-600">Temperature</p>
              <p className="font-mono text-navy-900">
                {ALERT_SEQUENCE.temperature.join(" → ")}°C
              </p>
            </div>
            <p className="text-slate-500">
              Step {demoStep} of {ALERT_SEQUENCE.heartRate.length}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {(showCritical || latestCritical) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border-2 border-red-300 bg-red-50 p-6 animate-pulse-soft shadow-elevated"
            >
              <div className="flex items-center gap-3 text-red-800">
                <Siren className="h-8 w-8" />
                <h2 className="text-xl font-bold">CRITICAL ALERT</h2>
                <span className="sr-only">Critical alert</span>
              </div>
              <p className="mt-2 font-medium text-red-700">
                James Mitchell · ICU-204 · Bed B-12
              </p>
              <div className="mt-4">
                <p className="text-sm font-semibold text-red-800">
                  Possible issues:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-red-700">
                  <li>• Oxygen level decreasing</li>
                  <li>• Abnormal heart-rate trend</li>
                  <li>• Immediate staff attention required</li>
                </ul>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => handleAction("Notify Nurse")}
                  className="inline-flex items-center gap-2 rounded-lg bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
                >
                  <Bell className="h-4 w-4" />
                  Notify Nurse
                </button>
                <button
                  onClick={() => handleAction("Notify Doctor")}
                  className="inline-flex items-center gap-2 rounded-lg bg-white border border-red-200 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
                >
                  <Stethoscope className="h-4 w-4" />
                  Notify Doctor
                </button>
                <button
                  onClick={() => handleAction("Escalate Emergency")}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  <Phone className="h-4 w-4" />
                  Escalate Emergency
                </button>
              </div>
              {actions.length > 0 && (
                <div className="mt-4 text-xs text-emerald-700">
                  Dispatched: {actions.join(", ")}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-navy-900">Alert History</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {alerts.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              No alerts yet. Run the simulation to trigger a critical alert.
            </p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 px-5 py-4 ${
                  alert.acknowledged ? "opacity-60" : ""
                }`}
              >
                <AlertTriangle
                  className={`h-5 w-5 shrink-0 ${
                    alert.severity === "critical"
                      ? "text-red-600"
                      : "text-amber-600"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium text-navy-900">{alert.message}</p>
                  <ul className="mt-1 text-sm text-slate-500">
                    {alert.issues.map((issue) => (
                      <li key={issue}>• {issue}</li>
                    ))}
                  </ul>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="text-sm text-medical-600 hover:underline"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
