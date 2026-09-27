"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Shield,
  Users,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Logo } from "@/components/layout/Logo";

const metrics = [
  {
    label: "Hospitals Connected",
    value: 12,
    icon: Building2,
    suffix: "",
  },
  {
    label: "Patients Monitored Today",
    value: 1247,
    icon: Users,
    suffix: "",
  },
  {
    label: "Critical Alerts Detected",
    value: 32,
    icon: Activity,
    suffix: "",
  },
  {
    label: "Average Response Improvement",
    value: 38,
    icon: Shield,
    suffix: "%",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-medical-50/30 to-white">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo size="large" />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-navy-900"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-medical-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-medical-700"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-medical-200 bg-medical-50 px-4 py-1.5 text-sm font-medium text-medical-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Pilot-ready · Hospital deployment phase
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-navy-900 md:text-6xl">
            Fynavo<span className="text-medical-600">X</span>
          </h1>
          <p className="mt-4 text-xl font-medium text-medical-700 md:text-2xl">
            Predict. Protect. Respond.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Help hospitals detect patient risks earlier and reduce delayed
            emergency response through AI-powered real-time monitoring.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-card transition-shadow hover:shadow-elevated"
              >
                <Icon className="mb-3 h-8 w-8 text-medical-600" />
                <p className="text-3xl font-bold text-navy-900">
                  <AnimatedCounter value={m.value} suffix={m.suffix} />
                </p>
                <p className="mt-2 text-sm text-slate-500">{m.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-medical-600 px-6 py-3 font-semibold text-white transition-all hover:bg-medical-700 hover:shadow-elevated"
          >
            View Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/simulation"
            className="inline-flex items-center gap-2 rounded-lg border border-medical-300 bg-medical-50 px-6 py-3 font-semibold text-medical-800 transition-all hover:bg-medical-100"
          >
            Live Clinical Simulation
          </Link>
          <Link
            href="/patients"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-navy-900 transition-all hover:border-medical-300 hover:bg-medical-50"
          >
            Patient Monitoring
          </Link>
          <Link
            href="/analytics"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-navy-900 transition-all hover:border-medical-300 hover:bg-medical-50"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 rounded-2xl border border-slate-200 bg-navy-900 p-8 text-white md:p-12"
        >
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold">Mission</h3>
              <p className="mt-2 text-sm text-slate-300">
                Early risk detection and faster emergency response for
                hospital care teams.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Deployment</h3>
              <p className="mt-2 text-sm text-slate-300">
                12 partner hospitals in active pilot. Enterprise SaaS ready for
                scale.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Technology</h3>
              <p className="mt-2 text-sm text-slate-300">
                Real-time vitals, ML risk scoring, WebSocket monitoring, and
                clinical alert workflows.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © 2026 FynavoX Healthcare Intelligence · Confidential Pilot Prototype
      </footer>
    </div>
  );
}
