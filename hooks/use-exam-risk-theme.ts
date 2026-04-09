"use client";

import { useMemo } from "react";

export function useExamRiskTheme(violationCount: number) {
  return useMemo(() => {
    if (violationCount >= 5) {
      return {
        shell: "bg-rose-50",
        header: "border-rose-300 bg-rose-100",
      };
    }

    if (violationCount >= 2) {
      return {
        shell: "bg-amber-50",
        header: "border-amber-300 bg-amber-100",
      };
    }

    return {
      shell: "bg-emerald-50",
      header: "border-emerald-300 bg-emerald-100",
    };
  }, [violationCount]);
}
