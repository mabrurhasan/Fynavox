"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, Cpu, Database, Loader2 } from "lucide-react";
import { useLivePatientsContext } from "@/context/LivePatientsContext";
import { RiskGauge } from "@/components/ui/RiskGauge";

const pipelineSteps = [
  "Vital trend analyzed",
  "Pattern anomaly detected",
  "Risk probability calculated",
  "Severity classified",
  "Emergency likelihood generated",
];

export default function AIEnginePage() {
  const { patients } = useLivePatientsContext();
  const critical = patients.find((p) => p.status === "critical") ?? patients[2];
  const [stepIndex, setStepIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((i) => {
        const next = (i + 1) % (pipelineSteps.length + 1);
        if (next > 0 && next <= pipelineSteps.length) {
          setLogs((prev) => [
            `[${new Date().toLocaleTimeString()}] ✓ ${pipelineSteps[next - 1]}`,
            ...prev.slice(0, 14),
          ]);
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-medical-100 p-3">
            <Brain className="h-8 w-8 text-medical-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">
              AI Analysis Engine
            </h1>
            <p className="text-xs font-medium text-medical-600">
              Live processing pipeline active
            </p>
            <p className="text-sm text-slate-500">
              FynavoX-Risk v2.1 · Scikit-learn inference · TensorFlow roadmap
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="mb-6 font-semibold text-navy-900">Live Processing Pipeline</h2>
          <div className="space-y-4">
            {pipelineSteps.map((step, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex - 1;
              return (
                <motion.div
                  key={step}
                  layout
                  className={`flex items-center gap-4 rounded-lg border p-4 ${
                    active
                      ? "border-medical-200 bg-medical-50"
                      : done
                        ? "border-emerald-100 bg-emerald-50/50"
                        : "border-slate-100 bg-slate-50/50"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  ) : active ? (
                    <Loader2 className="h-6 w-6 animate-spin text-medical-600" />
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-slate-200" />
                  )}
                  <span className="font-medium text-navy-900">✓ {step}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-navy-900">Current Analysis Target</h2>
            <div className="flex items-center gap-6">
              <RiskGauge score={critical.riskScore} size={120} />
              <div>
                <p className="font-semibold text-navy-900">{critical.name}</p>
                <p className="text-sm text-slate-500">{critical.room}</p>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">HR</p>
                    <p className="font-bold">{critical.vitals.heartRate} BPM</p>
                  </div>
                  <div>
                    <p className="text-slate-500">SpO₂</p>
                    <p className="font-bold">{critical.vitals.spo2}%</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Temp</p>
                    <p className="font-bold">{critical.vitals.temperature}°C</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-red-600 font-medium">
                  Emergency likelihood: High (87%)
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-semibold text-navy-900">Inference Log</h2>
            <div className="max-h-48 overflow-y-auto font-mono text-xs text-slate-600">
              {logs.length === 0 ? (
                <p className="text-slate-400">Waiting for pipeline cycle...</p>
              ) : (
                logs.map((log, i) => <p key={i} className="py-0.5">{log}</p>)
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Cpu, label: "Inference", value: "< 200ms" },
              { icon: Database, label: "Features", value: "24 dims" },
              { icon: Brain, label: "Model", value: "v2.1" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center"
              >
                <item.icon className="mx-auto h-5 w-5 text-medical-600" />
                <p className="mt-2 text-xs text-slate-500">{item.label}</p>
                <p className="font-semibold text-navy-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
