"use client";

import { ExamAttempt } from "@/lib/types";

export function TeacherGazeHeatmap({ attempts }: { attempts: ExamAttempt[] }) {
  const levels = attempts.map((attempt) => {
    const intensity = Math.min(100, attempt.violationCount * 18 + (100 - attempt.proctoringScore));
    return {
      id: attempt.id,
      student: attempt.studentId,
      intensity,
    };
  });

  return (
    <section className="rounded-xl border p-4">
      <h3 className="mb-3 text-lg font-medium">Live Gaze Heatmap</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {levels.map((item) => (
          <div
            key={item.id}
            className="rounded-md p-2 text-xs text-zinc-900"
            style={{ background: `rgba(239,68,68,${Math.max(0.15, item.intensity / 100)})` }}
            title={`${item.student}: ${item.intensity}`}
          >
            <p className="truncate font-medium">{item.student}</p>
            <p>Intensity {item.intensity}</p>
          </div>
        ))}
        {levels.length === 0 && <p className="col-span-full text-sm text-zinc-500">No active gaze data.</p>}
      </div>
    </section>
  );
}
