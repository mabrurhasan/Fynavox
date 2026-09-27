"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Play,
  RotateCcw,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { VitalChart } from "@/components/charts/VitalChart";
import { HeartbeatIcon } from "@/components/ui/HeartbeatIcon";
import { RiskGauge } from "@/components/ui/RiskGauge";
import { Logo } from "@/components/layout/Logo";
import {
  ACTIVITY_LOG,
  PATIENT,
  STAGE_LABELS,
  SIMULATION_DURATION_MS,
} from "@/lib/clinical-simulation";
import { useClinicalSimulation } from "@/hooks/useClinicalSimulation";
import { cn } from "@/lib/utils";
import { ECGWaveform } from "./ECGWaveform";
import { SimulationAIPanel } from "./SimulationAIPanel";

const statusStyles = {
  stable: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    ring: "",
  },
  observation: {
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-300",
    ring: "ring-2 ring-amber-200/80",
  },
  critical: {
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-300",
    ring: "ring-2 ring-red-300 animate-pulse-soft",
  },
};

export function ClinicalSimulationView() {
  const { runState, state, history, start, reset } = useClinicalSimulation();

  const idle = runState === "idle";
  const complete = runState === "complete";
  const running = runState === "running";
  const s = state;
  const stage = s.stage;
  const styles = statusStyles[s.status];
  const frozen = idle && !running;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Logo />
            <div>
              <h1 className="text-lg font-bold text-navy-900">
                Live Clinical Scenario Simulation
              </h1>
              <p className="text-sm text-slate-500">
                Potential respiratory deterioration · ICU post-operative monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!running ? (
              <button
                type="button"
                onClick={() => {
                  reset();
                  start();
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-medical-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-medical-700"
              >
                {complete ? (
                  <>
                    <RotateCcw className="h-4 w-4" />
                    Replay Simulation
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Simulation
                  </>
                )}
              </button>
            ) : (
              <span className="flex items-center gap-2 rounded-lg bg-medical-50 px-4 py-2 text-sm font-medium text-medical-700">
                <Activity className="h-4 w-4 animate-pulse" />
                Running · {STAGE_LABELS[stage]}
              </span>
            )}
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Exit
            </Link>
          </div>
        </div>
        {running && (
          <div className="h-1 bg-slate-100">
            <motion.div
              className="h-full bg-medical-600"
              style={{ width: `${s.progress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {frozen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-xl border border-medical-200 bg-medical-50/50 p-6"
          >
            <p className="text-sm text-slate-700">
              This 25-second demonstration shows how FynavoX identifies early
              deterioration in ICU patient{" "}
              <strong>{PATIENT.name}</strong> and supports clinical response
              workflows. Press <strong>Start Simulation</strong> to begin.
            </p>
          </motion.div>
        )}

        <div className={frozen ? "opacity-90" : ""}>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <motion.div
                layout
                className={cn(
                  "rounded-xl border bg-white p-6 shadow-card transition-all duration-500",
                  styles.border,
                  styles.ring,
                  s.status === "critical" && "animate-pulse-soft"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-navy-900">
                      {PATIENT.name}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Age {PATIENT.age} · {PATIENT.room} · Bed {PATIENT.bed}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {PATIENT.condition}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <RiskGauge score={s.riskScore} size={88} />
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold",
                        styles.bg,
                        styles.text
                      )}
                    >
                      <span
                        className={cn("h-2.5 w-2.5 rounded-full", styles.dot)}
                      />
                      {s.statusLabel}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  <VitalBlock
                    label="Heart Rate"
                    value={`${s.vitals.heartRate}`}
                    unit="BPM"
                    icon={<HeartbeatIcon bpm={s.vitals.heartRate} />}
                  />
                  <VitalBlock
                    label="SpO₂"
                    value={`${s.vitals.spo2}`}
                    unit="%"
                  />
                  <VitalBlock
                    label="Temperature"
                    value={`${s.vitals.temperature}`}
                    unit="°C"
                  />
                  <VitalBlock
                    label="Respiratory Rate"
                    value={`${s.vitals.respiratoryRate}`}
                    unit="/min"
                  />
                  <VitalBlock
                    label="Blood Pressure"
                    value={s.vitals.bloodPressure}
                    unit="mmHg"
                  />
                </div>

                <div className="mt-6">
                  <ECGWaveform
                    heartRate={s.vitals.heartRate}
                    accelerated={s.stage >= 3}
                  />
                </div>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ChartCard
                  data={history.heartRate}
                  label="Heart Rate"
                  color="#dc2626"
                  unit=" BPM"
                />
                <ChartCard
                  data={history.spo2}
                  label="SpO₂"
                  color="#0069c6"
                  unit="%"
                />
                <ChartCard
                  data={history.temperature}
                  label="Temperature"
                  color="#d97706"
                  unit="°C"
                />
                <ChartCard
                  data={history.respiratoryRate}
                  label="Respiratory Rate"
                  color="#7c3aed"
                  unit="/min"
                />
              </div>

              {s.showWorkflow && !s.showSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border-2 border-red-200 bg-white p-6 shadow-elevated"
                >
                  <div className="flex items-center gap-3 text-red-800">
                    <motion.div
                      animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                      transition={{ duration: 0.5, repeat: 2 }}
                    >
                      <AlertTriangle className="h-7 w-7" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold">CRITICAL ALERT GENERATED</h3>
                      <p className="text-sm text-red-600">Timestamp: 09:41:32</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {["Nurse notified", "Doctor notified", "Case escalated"].map(
                      (action) => (
                        <span
                          key={action}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {action}
                        </span>
                      )
                    )}
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Activity log
                    </p>
                    <ul className="mt-2 space-y-2">
                      {ACTIVITY_LOG.map((entry, i) => (
                        <motion.li
                          key={entry.time}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.35 }}
                          className="flex gap-3 font-mono text-sm text-slate-700"
                        >
                          <span className="text-slate-400">{entry.time}</span>
                          <span>{entry.message}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {s.showSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-medical-200 bg-gradient-to-br from-white to-medical-50/40 p-8 shadow-card"
                >
                  <h3 className="text-xl font-bold text-navy-900">
                    FynavoX Clinical Summary
                  </h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <SummaryItem label="Patient" value={PATIENT.name} />
                    <SummaryItem label="Detection time" value="3.2 sec" />
                    <SummaryItem label="AI confidence" value="91%" />
                    <SummaryItem
                      label="Current status"
                      value="Emergency workflow active"
                    />
                  </div>
                  <div className="mt-6 space-y-2">
                    {[
                      "Risk identified early",
                      "Staff notified",
                      "Clinical workflow activated",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-sm font-medium text-emerald-800"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="mt-8 border-t border-slate-200 pt-6 text-center text-sm italic text-slate-600">
                    &ldquo;FynavoX supports healthcare teams through continuous
                    monitoring, intelligent risk analysis, and timely clinical
                    alerts.&rdquo;
                  </p>
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        start();
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-medical-300 bg-white px-5 py-2.5 text-sm font-semibold text-medical-700 hover:bg-medical-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Run Again
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-6">
              <SimulationAIPanel stage={stage} />

              <AnimatePresence>
                {running && s.showAlert && !s.showSummary && (
                  <motion.div
                    initial={{ x: 120, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 120, opacity: 0 }}
                    className={cn(
                      "rounded-xl border-2 p-5 shadow-elevated",
                      s.status === "critical"
                        ? "border-red-300 bg-red-50 animate-pulse-soft"
                        : "border-amber-200 bg-amber-50"
                    )}
                  >
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-bold">
                        {s.status === "critical"
                          ? "CRITICAL ALERT"
                          : "Clinical Notice"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-red-700">
                      {PATIENT.name} · {PATIENT.room}
                    </p>
                    {s.status === "critical" && (
                      <ul className="mt-3 space-y-1 text-sm text-red-700">
                        <li>• Rapid oxygen decline</li>
                        <li>• Abnormal heart-rate trend</li>
                        <li>• Immediate staff attention required</li>
                      </ul>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <ActionChip icon={Bell} label="Notify Nurse" />
                      <ActionChip icon={Stethoscope} label="Notify Doctor" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
                <p>
                  Duration: {SIMULATION_DURATION_MS / 1000}s · Scenario: ICU
                  respiratory deterioration
                </p>
                <p className="mt-1">
                  Stage {stage}/5 · {Math.round(s.progress * 100)}% complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function VitalBlock({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value: string;
  unit: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
      <div className="flex items-center gap-1 text-xs text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-xl font-bold text-navy-900">
        {value}
        <span className="text-xs font-normal text-slate-500"> {unit}</span>
      </p>
    </div>
  );
}

function ChartCard({
  data,
  label,
  color,
  unit,
}: {
  data: number[];
  label: string;
  color: string;
  unit: string;
}) {
  if (data.length < 2) {
    return (
      <div className="h-44 animate-pulse rounded-xl border border-slate-200 bg-white p-4">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="mt-4 h-28 rounded bg-slate-100" />
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <VitalChart data={data} label={label} color={color} unit={unit} />
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-navy-900">{value}</p>
    </div>
  );
}

function ActionChip({
  icon: Icon,
  label,
}: {
  icon: typeof Bell;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-800">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
