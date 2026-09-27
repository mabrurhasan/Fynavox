"use client";

import { Sidebar } from "./Sidebar";
import { NotificationToast } from "@/components/ui/NotificationToast";
import { LivePatientsProvider, useLivePatientsContext } from "@/context/LivePatientsContext";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { notifications } = useLivePatientsContext();
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 min-h-screen">{children}</main>
      <NotificationToast notifications={notifications} />
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LivePatientsProvider>
      <DashboardShell>{children}</DashboardShell>
    </LivePatientsProvider>
  );
}
