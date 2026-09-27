"use client";

import {
  Activity,
  AlertTriangle,
  BedDouble,
  Heart,
  Users,
  Wifi,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PatientCard } from "@/components/dashboard/PatientCard";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { AIPanel } from "@/components/dashboard/AIPanel";
import { RiskHeatmap } from "@/components/dashboard/RiskHeatmap";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useLivePatientsContext } from "@/context/LivePatientsContext";

const trendData = [
  { hour: "06:00", alerts: 4, patients: 1180 },
  { hour: "08:00", alerts: 8, patients: 1210 },
  { hour: "10:00", alerts: 12, patients: 1235 },
  { hour: "12:00", alerts: 18, patients: 1240 },
  { hour: "14:00", alerts: 24, patients: 1247 },
  { hour: "16:00", alerts: 28, patients: 1247 },
  { hour: "18:00", alerts: 32, patients: 1247 },
];

export default function DashboardPage() {
  const { patients, alerts, metrics, acknowledgeAlert, lastUpdate } =
    useLivePatientsContext();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            Hospital Command Center
          </h1>
          <p className="text-sm text-slate-500">
            Real-time monitoring · Last sync {lastUpdate}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5">
          <Wifi className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">
            Monitoring {metrics.monitoringStatus}
          </span>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Patients"
          value={metrics.totalPatients.toLocaleString()}
          subtitle={`${metrics.wardPatients} in active ICU ward`}
          icon={Users}
        />
        <MetricCard
          title="Critical Patients"
          value={metrics.criticalPatients}
          icon={Heart}
          variant={metrics.criticalPatients > 0 ? "critical" : "default"}
        />
        <MetricCard
          title="Active Alerts"
          value={metrics.activeAlerts}
          icon={AlertTriangle}
          variant={metrics.activeAlerts > 0 ? "critical" : "default"}
        />
        <MetricCard
          title="Monitoring Status"
          value="Online"
          subtitle="12 hospitals · All wards connected"
          icon={Activity}
          variant="success"
        />
        <MetricCard
          title="Bed Occupancy"
          value={`${metrics.bedOccupancy}%`}
          icon={BedDouble}
          trend={`${metrics.bedsAvailable} beds available`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="mb-4 font-semibold text-navy-900">
              Live Patient Monitoring
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {patients.slice(0, 4).map((p) => (
                <PatientCard key={p.id} patient={p} compact />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-4 font-semibold text-navy-900">
              Alert & Patient Trends
            </h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="alerts"
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.1}
                    name="Alerts"
                    animationDuration={1000}
                  />
                  <Area
                    type="monotone"
                    dataKey="patients"
                    stroke="#0069c6"
                    fill="#0069c6"
                    fillOpacity={0.1}
                    name="Patients"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <AlertPanel alerts={alerts} onAcknowledge={acknowledgeAlert} />
          <AIPanel />
          <RiskHeatmap patients={patients} />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
