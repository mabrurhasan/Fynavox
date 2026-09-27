"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Stethoscope, UserCog } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const roles: {
  id: UserRole;
  label: string;
  description: string;
  icon: typeof Stethoscope;
}[] = [
  {
    id: "doctor",
    label: "Doctor",
    description: "Full clinical access, alerts & patient records",
    icon: Stethoscope,
  },
  {
    id: "nurse",
    label: "Nurse",
    description: "Ward monitoring, vitals & alert response",
    icon: Shield,
  },
  {
    id: "admin",
    label: "Admin",
    description: "Hospital operations, analytics & system config",
    icon: UserCog,
  },
];

export default function AuthPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!selected) return;
    setLoading(true);
    sessionStorage.setItem("fynavox_role", selected);
    setTimeout(() => router.push("/dashboard"), 800);
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-navy-900 p-12 lg:flex lg:flex-col lg:justify-between">
        <Logo />
        <div>
          <h1 className="text-3xl font-bold text-white">
            Hospital Command Center
          </h1>
          <p className="mt-4 text-slate-300">
            Secure role-based access for clinical staff. FynavoX monitors
            patients in real time and surfaces critical risks before they
            escalate.
          </p>
          <div className="mt-8 space-y-3">
            {["HIPAA-aligned architecture", "SOC 2 readiness", "24/7 monitoring"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-medical-400" />
                  {item}
                </div>
              )
            )}
          </div>
        </div>
        <p className="text-xs text-slate-500">FynavoX Pilot · v1.0.0</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold text-navy-900">Sign in to FynavoX</h2>
          <p className="mt-2 text-slate-600">Select your role to continue</p>

          <div className="mt-8 space-y-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const active = selected === role.id;
              return (
                <motion.button
                  key={role.id}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelected(role.id)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
                    active
                      ? "border-medical-500 bg-medical-50 shadow-card"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg p-3",
                      active ? "bg-medical-600 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">{role.label}</p>
                    <p className="text-sm text-slate-500">{role.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selected || loading}
            className="mt-8 w-full rounded-lg bg-medical-600 py-3 font-semibold text-white transition-colors hover:bg-medical-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Continue to Dashboard"}
          </button>

          <p className="mt-6 text-center text-xs text-slate-500">
            Demo prototype · No credentials required
          </p>
        </div>
      </div>
    </div>
  );
}
