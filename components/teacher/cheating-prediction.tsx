"use client";

import { ExamAttempt, ProctorIncident } from "@/lib/types";

function computeRisk(attempt: ExamAttempt, incidents: ProctorIncident[]) {
  const recent = incidents.filter((x) => x.studentId === attempt.studentId).slice(0, 8);
  const severityScore = recent.reduce((acc, item) => {
    if (item.severity === "high") {
      return acc + 14;
    }
    if (item.severity === "medium") {
      return acc + 8;
    }
    return acc + 4;
  }, 0);

  const baseline = attempt.violationCount * 10 + (100 - attempt.proctoringScore);
  return Math.min(99, Math.max(1, baseline + severityScore));
}

export function CheatingPrediction({
  attempts,
  incidents,
}: {
  attempts: ExamAttempt[];
  incidents: ProctorIncident[];
}) {
  const predictions = attempts
    .map((attempt) => ({
      id: attempt.id,
      studentId: attempt.studentId,
      probability: computeRisk(attempt, incidents),
    }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 6);

  return (
    <section className="rounded-xl border p-4">
      <h3 className="mb-3 text-lg font-medium">AI Cheating Prediction</h3>
      <div className="space-y-2">
        {predictions.map((item) => (
          <div key={item.id} className="rounded-md border p-2">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">{item.studentId}</span>
              <span>{item.probability}% risk</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
              <div className="h-full rounded-full bg-rose-500" style={{ width: `${item.probability}%` }} />
            </div>
          </div>
        ))}
        {predictions.length === 0 && <p className="text-sm text-zinc-500">No predictions yet.</p>}
      </div>
    </section>
  );
}
