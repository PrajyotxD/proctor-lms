"use client";

import { useEffect, useMemo, useState } from "react";

export function StudentHud({
  violationCount,
  isFrozen,
}: {
  violationCount: number;
  isFrozen: boolean;
}) {
  const [heartRate, setHeartRate] = useState(74);
  const [focusLevel, setFocusLevel] = useState(92);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeartRate((prev) => {
        const drift = Math.floor(Math.random() * 5) - 2;
        const stress = violationCount > 0 ? 1 + Math.min(violationCount, 6) : 0;
        return Math.min(130, Math.max(60, prev + drift + stress));
      });
      setFocusLevel((prev) => {
        const decay = violationCount > 0 ? Math.min(8, violationCount + 2) : 1;
        const jitter = Math.floor(Math.random() * 4) - 1;
        return Math.min(100, Math.max(35, prev - decay + jitter));
      });
    }, 2500);

    return () => window.clearInterval(id);
  }, [violationCount]);

  const statusLabel = useMemo(() => {
    if (isFrozen) {
      return "Frozen";
    }
    if (violationCount >= 5) {
      return "Critical";
    }
    if (violationCount >= 2) {
      return "Alert";
    }
    return "Stable";
  }, [isFrozen, violationCount]);

  return (
    <div className="rounded-xl border border-cyan-200/70 bg-cyan-50/60 p-3 text-xs text-cyan-900 backdrop-blur-sm">
      <p className="font-semibold tracking-wide">HUD</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-md border border-cyan-200 bg-white/70 p-2">
          <p className="text-[10px] uppercase text-cyan-700">Focus</p>
          <p className="text-base font-semibold">{focusLevel}%</p>
        </div>
        <div className="rounded-md border border-cyan-200 bg-white/70 p-2">
          <p className="text-[10px] uppercase text-cyan-700">Heart</p>
          <p className="text-base font-semibold">{heartRate} bpm</p>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-cyan-800">Status: {statusLabel}</p>
    </div>
  );
}
