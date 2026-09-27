"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const dailyAlerts = [
  { day: "Mon", alerts: 18, resolved: 16 },
  { day: "Tue", alerts: 24, resolved: 22 },
  { day: "Wed", alerts: 32, resolved: 28 },
  { day: "Thu", alerts: 28, resolved: 26 },
  { day: "Fri", alerts: 35, resolved: 31 },
  { day: "Sat", alerts: 22, resolved: 20 },
  { day: "Sun", alerts: 19, resolved: 18 },
];

const weeklyPatients = [
  { week: "W1", monitored: 8200, critical: 120 },
  { week: "W2", monitored: 9100, critical: 98 },
  { week: "W3", monitored: 10200, critical: 145 },
  { week: "W4", monitored: 11800, critical: 132 },
];

const icuRisk = [
  { name: "Low", value: 45, color: "#059669" },
  { name: "Moderate", value: 32, color: "#d97706" },
  { name: "High", value: 18, color: "#dc2626" },
  { name: "Critical", value: 5, color: "#7f1d1d" },
];

const predictions = [
  { metric: "Cardiac events", probability: 12 },
  { metric: "Respiratory decline", probability: 18 },
  { metric: "Sepsis indicators", probability: 8 },
  { metric: "Fall risk", probability: 22 },
];

const stats = [
  { label: "Avg response time", value: "4.2 min", change: "-38%" },
  { label: "False alert rate", value: "6.1%", change: "-24%" },
  { label: "Uptime", value: "99.97%", change: "+0.02%" },
  { label: "Patients/day", value: "1,247", change: "+12%" },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Analytics</h1>
        <p className="text-sm text-slate-500">
          Hospital-wide insights · Emergency prediction · Monitoring statistics
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-card"
          >
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-navy-900">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-emerald-600">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-4 font-semibold text-navy-900">Daily Alerts</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyAlerts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="alerts" fill="#dc2626" radius={[4, 4, 0, 0]} animationDuration={1000} />
                <Bar dataKey="resolved" fill="#0069c6" radius={[4, 4, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-4 font-semibold text-navy-900">Weekly Patient Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyPatients}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="monitored"
                  stroke="#0069c6"
                  strokeWidth={2}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="critical"
                  stroke="#dc2626"
                  strokeWidth={2}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-4 font-semibold text-navy-900">ICU Risk Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={icuRisk}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {icuRisk.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-4 font-semibold text-navy-900">
            Emergency Prediction Insights
          </h2>
          <div className="space-y-4">
            {predictions.map((p) => (
              <div key={p.metric}>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{p.metric}</span>
                  <span className="font-semibold text-navy-900">
                    {p.probability}%
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-medical-600 transition-all duration-1000"
                    style={{ width: `${p.probability}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Based on 30-day rolling ML model · Updated hourly
          </p>
        </div>
      </div>
    </div>
  );
}
