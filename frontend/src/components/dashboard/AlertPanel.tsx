"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check } from "lucide-react";
import type { Alert } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface AlertPanelProps {
  alerts: Alert[];
  onAcknowledge?: (id: string) => void;
}

export function AlertPanel({ alerts, onAcknowledge }: AlertPanelProps) {
  const active = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-navy-900">Active Alerts</h2>
        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          {active.length}
        </span>
      </div>
      <div className="max-h-80 overflow-y-auto p-3">
        <AnimatePresence mode="popLayout">
          {active.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-slate-500">
              No active alerts
            </p>
          ) : (
            active.map((alert) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`mb-2 rounded-lg border p-3 ${
                  alert.severity === "critical"
                    ? "border-red-200 bg-red-50 animate-pulse-soft"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      alert.severity === "critical"
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900">
                      {alert.message}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatTime(alert.timestamp)}
                    </p>
                  </div>
                  {onAcknowledge && (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="rounded p-1 hover:bg-white/80"
                      title="Acknowledge"
                    >
                      <Check className="h-4 w-4 text-slate-500" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
