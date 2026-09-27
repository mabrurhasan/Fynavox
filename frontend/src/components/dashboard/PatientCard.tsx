"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeartbeatIcon } from "@/components/ui/HeartbeatIcon";
import { RiskGauge } from "@/components/ui/RiskGauge";
import type { Patient } from "@/lib/types";
import { statusColor, cn } from "@/lib/utils";

const PATIENT_LABELS: Record<string, string> = {
  A: "Patient A",
  B: "Patient B",
  C: "Patient C",
};

interface PatientCardProps {
  patient: Patient;
  compact?: boolean;
}

export function PatientCard({ patient, compact = false }: PatientCardProps) {
  const status = statusColor(patient.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-xl border bg-white p-4 shadow-card transition-shadow hover:shadow-elevated",
        patient.status === "critical" && "border-red-200 animate-pulse-soft",
        status.border
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-navy-900">{patient.name}</h3>
            {PATIENT_LABELS[patient.id] && (
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                {PATIENT_LABELS[patient.id]}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Age {patient.age} · {patient.room} · Bed {patient.bed}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
            status.bg,
            status.text
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <HeartbeatIcon bpm={patient.vitals.heartRate} />
            HR
          </div>
          <p className="text-lg font-bold text-navy-900">
            {patient.vitals.heartRate}
            <span className="text-xs font-normal text-slate-500"> BPM</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">SpO₂</p>
          <p className="text-lg font-bold text-navy-900">
            {patient.vitals.spo2}
            <span className="text-xs font-normal text-slate-500">%</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Temp</p>
          <p className="text-lg font-bold text-navy-900">
            {patient.vitals.temperature}
            <span className="text-xs font-normal text-slate-500">°C</span>
          </p>
        </div>
      </div>

      {!compact && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <RiskGauge score={patient.riskScore} size={80} />
          <Link
            href={`/patients?id=${patient.id}`}
            className="text-sm font-medium text-medical-600 hover:text-medical-700"
          >
            View details →
          </Link>
        </div>
      )}
    </motion.div>
  );
}
