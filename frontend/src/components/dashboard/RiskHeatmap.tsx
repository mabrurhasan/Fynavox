"use client";

import type { Patient } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RiskHeatmapProps {
  patients: Patient[];
}

const wards = ["ICU-201", "ICU-204", "Ward-105", "Ward-112", "Ward-118", "ER-302"];

export function RiskHeatmap({ patients }: RiskHeatmapProps) {
  const getRisk = (ward: string) => {
    const p = patients.find((x) => x.room === ward);
    return p?.riskScore ?? Math.floor(Math.random() * 30 + 10);
  };

  const cellColor = (risk: number) => {
    if (risk >= 70) return "bg-red-500";
    if (risk >= 40) return "bg-amber-400";
    if (risk >= 25) return "bg-medical-300";
    return "bg-emerald-400";
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <h2 className="mb-4 font-semibold text-navy-900">Risk Heatmap</h2>
      <div className="grid grid-cols-3 gap-2">
        {wards.map((ward) => {
          const risk = getRisk(ward);
          return (
            <div
              key={ward}
              className="flex flex-col items-center rounded-lg border border-slate-100 p-3"
            >
              <div
                className={cn(
                  "mb-2 h-10 w-full rounded-md transition-colors",
                  cellColor(risk)
                )}
                style={{ opacity: 0.4 + (risk / 100) * 0.6 }}
              />
              <span className="text-xs font-medium text-slate-600">{ward}</span>
              <span className="text-xs text-slate-400">Risk {risk}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded bg-emerald-400" /> Low
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded bg-amber-400" /> Moderate
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded bg-red-500" /> Critical
        </span>
      </div>
    </div>
  );
}
