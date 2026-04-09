"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { ExamAttempt, ProctorIncident } from "@/lib/types";

export function TeacherAnalytics({
  attempts,
  incidents,
}: {
  attempts: ExamAttempt[];
  incidents: ProctorIncident[];
}) {
  const scoreTrend = attempts.slice(0, 20).map((attempt, index) => ({
    index: index + 1,
    score: attempt.proctoringScore,
  }));

  const incidentMap = incidents.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {});

  const violationData = Object.entries(incidentMap).map(([type, count]) => ({ type, count }));
  const densityData = attempts.slice(0, 20).map((attempt, index) => {
    const related = incidents.filter((incident) => incident.attemptId === attempt.id).length;
    return { slot: index + 1, density: related };
  });

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-2xl border border-slate-700/70 bg-[#0b1220] p-4">
        <h3 className="mb-3 font-medium">Proctoring Score Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="index" stroke="#94a3b8" />
              <YAxis domain={[0, 100]} stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-700/70 bg-[#0b1220] p-4">
        <h3 className="mb-3 font-medium">Incident Density Heatmap</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={densityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="slot" stroke="#94a3b8" />
              <YAxis allowDecimals={false} stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="density" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-700/70 bg-[#0b1220] p-4">
        <h3 className="mb-3 font-medium">Violation Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={violationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="type" hide />
              <YAxis allowDecimals={false} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="count" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
