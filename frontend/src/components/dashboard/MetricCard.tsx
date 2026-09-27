"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "critical" | "success";
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: MetricCardProps) {
  const variants = {
    default: "border-slate-200 bg-white",
    critical: "border-red-200 bg-red-50/50",
    success: "border-emerald-200 bg-emerald-50/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`rounded-xl border p-5 shadow-card transition-shadow hover:shadow-elevated ${variants[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-navy-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <p className="mt-2 text-xs font-medium text-emerald-600">{trend}</p>
          )}
        </div>
        <div className="rounded-lg bg-medical-50 p-2.5">
          <Icon className="h-5 w-5 text-medical-600" />
        </div>
      </div>
    </motion.div>
  );
}
