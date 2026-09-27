"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, Brain, User } from "lucide-react";

const templates = [
  { type: "vitals", icon: Activity, msg: "Vitals updated for Ward-118" },
  { type: "ai", icon: Brain, msg: "AI risk recalculated — ICU-201" },
  { type: "alert", icon: AlertTriangle, msg: "Moderate alert flagged — ER-302" },
  { type: "staff", icon: User, msg: "Nurse Patel acknowledged alert" },
  { type: "vitals", icon: Activity, msg: "SpO₂ trend analyzed — Patient B" },
];

export function ActivityFeed() {
  const [items, setItems] = useState(
    templates.slice(0, 4).map((t, i) => ({
      id: String(i),
      ...t,
      time: `${10 + i}:${20 + i * 3}`,
    }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const t = templates[Math.floor(Math.random() * templates.length)];
      const now = new Date();
      setItems((prev) => [
        {
          id: crypto.randomUUID(),
          ...t,
          time: now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
        ...prev.slice(0, 7),
      ]);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-navy-900">Recent Activity</h2>
      </div>
      <div className="max-h-64 overflow-y-auto p-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 border-b border-slate-50 py-2.5 last:border-0"
              >
                <div className="rounded-lg bg-slate-100 p-1.5">
                  <Icon className="h-3.5 w-3.5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{item.msg}</p>
                  <p className="text-xs text-slate-400">{item.time}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
