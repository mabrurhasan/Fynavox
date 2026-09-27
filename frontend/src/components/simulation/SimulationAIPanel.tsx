"use client";

import { motion } from "framer-motion";
import { Brain, CheckCircle2 } from "lucide-react";
import {
  getAIPanelContent,
  type SimulationStage,
} from "@/lib/clinical-simulation";

interface SimulationAIPanelProps {
  stage: SimulationStage;
}

export function SimulationAIPanel({ stage }: SimulationAIPanelProps) {
  const content = getAIPanelContent(stage);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <Brain className="h-5 w-5 text-medical-600" />
        <h2 className="font-semibold text-navy-900">{content.title}</h2>
        {stage <= 2 && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        )}
      </div>
      <div className="space-y-3 p-5">
        {content.steps.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-2 text-sm text-slate-700"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{step}</span>
          </motion.div>
        ))}

        {content.detected && (
          <div className="mt-2 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Detected
            </p>
            <ul className="mt-2 space-y-1.5">
              {content.detected.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {item}
                </li>
              ))}
            </ul>
            {content.condition && (
              <p className="mt-3 text-sm">
                <span className="font-medium text-slate-600">Possible condition: </span>
                <span className="font-semibold text-navy-900">{content.condition}</span>
              </p>
            )}
            {content.confidence != null && (
              <p className="mt-2 text-sm font-semibold text-medical-700">
                AI Confidence: {content.confidence}%
              </p>
            )}
            {content.actions && (
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Recommended actions
                </p>
                {content.actions.map((a) => (
                  <li key={a}>• {a}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
