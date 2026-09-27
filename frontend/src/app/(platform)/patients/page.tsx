"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { PatientCard } from "@/components/dashboard/PatientCard";
import { VitalChart } from "@/components/charts/VitalChart";
import { RiskGauge } from "@/components/ui/RiskGauge";
import { useLivePatientsContext } from "@/context/LivePatientsContext";
import { statusColor, cn } from "@/lib/utils";

function PatientsContent() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get("id");
  const { patients, lastUpdate } = useLivePatientsContext();

  const focused = focusId
    ? patients.find((p) => p.id === focusId)
    : patients.find((p) => p.id === "A");

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Patient Monitoring</h1>
        <p className="text-sm text-slate-500">
          Live vitals updating every 1–2s · {lastUpdate}
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((p) => (
          <PatientCard key={p.id} patient={p} />
        ))}
      </div>

      {focused && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-card"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-navy-900">
                Detailed View — {focused.name}
              </h2>
              <p className="text-sm text-slate-500">
                {focused.room} · Bed {focused.bed} · Age {focused.age}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <RiskGauge score={focused.riskScore} size={100} />
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-medium",
                  statusColor(focused.status).bg,
                  statusColor(focused.status).text
                )}
              >
                {statusColor(focused.status).label}
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <VitalChart
              data={focused.history.heartRate}
              label="Heart Rate Trend"
              color="#dc2626"
              unit=" BPM"
            />
            <VitalChart
              data={focused.history.spo2}
              label="SpO₂ Trend"
              color="#0069c6"
              unit="%"
            />
            <VitalChart
              data={focused.history.temperature}
              label="Temperature Trend"
              color="#d97706"
              unit="°C"
            />
            <VitalChart
              data={focused.history.risk}
              label="Risk Score Trend"
              color="#7c3aed"
              variant="line"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading patients...</div>}>
      <PatientsContent />
    </Suspense>
  );
}
