"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Building2,
  LayoutDashboard,
  LogOut,
  PlayCircle,
  Users,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
  { href: "/patients", label: "Patient Monitoring", icon: Users },
  {
    href: "/simulation",
    label: "Clinical Simulation",
    icon: PlayCircle,
  },
  { href: "/ai-engine", label: "AI Intelligence", icon: Brain },
  { href: "/alerts", label: "Smart Alerts", icon: AlertTriangle },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/impact", label: "Business Impact", icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-medical-50 text-medical-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-navy-900"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-medical-600")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
          <Activity className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">
            System Online
          </span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-navy-900"
        >
          <LogOut className="h-4 w-4" />
          Exit Platform
        </Link>
      </div>
    </aside>
  );
}
