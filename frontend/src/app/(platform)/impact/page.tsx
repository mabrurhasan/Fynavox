"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Cloud,
  Cpu,
  DollarSign,
  Heart,
  Server,
  TrendingUp,
} from "lucide-react";

const problems = [
  "Reduce delayed response",
  "Reduce staff overload",
  "Reduce false alerts",
  "Improve monitoring efficiency",
];

const revenue = [
  {
    title: "Hospital SaaS Subscriptions",
    description: "Per-bed monthly licensing for ward & ICU monitoring",
    icon: Cloud,
  },
  {
    title: "Enterprise Licensing",
    description: "Multi-hospital deployments with SLA & dedicated support",
    icon: Server,
  },
  {
    title: "AI Analytics Subscriptions",
    description: "Advanced prediction models & custom risk scoring",
    icon: Cpu,
  },
  {
    title: "Future Hardware Integration",
    description: "FDA-ready wearable sensors & bedside device partnerships",
    icon: Heart,
  },
];

const milestones = [
  { phase: "Pilot", status: "Active", detail: "12 hospitals connected" },
  { phase: "Series A", status: "Preparing", detail: "Q3 2026 target" },
  { phase: "FDA Pathway", status: "Planned", detail: "Class II software" },
];

export default function ImpactPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Business Impact</h1>
        <p className="text-sm text-slate-500">
          Problems solved · Revenue model · Growth trajectory
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-navy-900">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Problems Solved
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {problems.map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span className="font-medium text-navy-900">✓ {p}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-navy-900">
          <DollarSign className="h-5 w-5 text-medical-600" />
          Revenue Model
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {revenue.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-elevated"
            >
              <r.icon className="mb-3 h-8 w-8 text-medical-600" />
              <h3 className="font-semibold text-navy-900">{r.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{r.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-navy-900 p-8 text-white">
        <h2 className="mb-6 text-lg font-semibold">Company Milestones</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {milestones.map((m) => (
            <div key={m.phase} className="border-l-2 border-medical-400 pl-4">
              <p className="text-sm text-medical-300">{m.phase}</p>
              <p className="text-xl font-bold">{m.status}</p>
              <p className="mt-1 text-sm text-slate-400">{m.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-400">
          FynavoX is positioned for hospital pilot deployment and scalable
          healthcare SaaS growth — built for investors, clinical partners, and
          enterprise procurement.
        </p>
      </div>
    </div>
  );
}
