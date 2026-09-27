"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, Loader2 } from "lucide-react";

const steps = [
  "Vital trend analyzed",
  "Pattern anomaly detected",
  "Risk probability calculated",
  "Severity classified",
  "Emergency likelihood generated",
];

export function AIPanel() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => (s + 1) % (steps.length + 1));
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <Brain className="h-5 w-5 text-medical-600" />
        <h2 className="font-semibold text-navy-900">AI Intelligence</h2>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>
      <div className="space-y-2 p-4">
        {steps.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep - 1 || (activeStep === 0 && i === 0);
          return (
            <motion.div
              key={step}
              initial={false}
              animate={{ opacity: done || active ? 1 : 0.5 }}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5"
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : active ? (
                <Loader2 className="h-4 w-4 animate-spin text-medical-600" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-slate-200" />
              )}
              <span className="text-sm text-slate-700">{step}</span>
            </motion.div>
          );
        })}
      </div>
      <div className="border-t border-slate-100 px-5 py-3">
        <p className="text-xs text-slate-500">
          Model: FynavoX-Risk v2.1 · Last inference &lt; 200ms
        </p>
      </div>
    </div>
  );
}
