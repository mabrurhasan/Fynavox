"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Bell } from "lucide-react";

interface NotificationToastProps {
  notifications: { id: string; message: string; type: "info" | "critical" }[];
}

export function NotificationToast({ notifications }: NotificationToastProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 120, opacity: 0 }}
            className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-elevated ${
              n.type === "critical"
                ? "animate-pulse-soft border-red-200 bg-red-50 text-red-800"
                : "border-slate-200 bg-white text-navy-900"
            }`}
          >
            {n.type === "critical" ? (
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
            ) : (
              <Bell className="h-5 w-5 shrink-0 text-medical-600" />
            )}
            <span className="text-sm font-medium">{n.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
