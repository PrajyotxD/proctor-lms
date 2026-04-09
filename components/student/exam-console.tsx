"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { useAuth } from "@/components/auth/auth-provider";
import { getFirebaseServices } from "@/lib/firebase/client";
import { Exam, ExamAttempt } from "@/lib/types";
import { now } from "@/lib/utils";
import { useExamProctoring } from "@/hooks/use-exam-proctoring";
import { StudentHud } from "@/components/student/student-hud";
import { StudyBuddy } from "@/components/student/study-buddy";
import { Scratchpad } from "@/components/student/scratchpad";
import { useExamRiskTheme } from "@/hooks/use-exam-risk-theme";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ExamConsole({ examId }: { examId: string }) {
  const { user } = useAuth();
  const services = getFirebaseServices();
  const [exam, setExam] = useState<Exam | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  const attemptId = useMemo(() => (user ? `${examId}_${user.uid}` : null), [examId, user]);

  useEffect(() => {
    if (!services) return;
    return onSnapshot(doc(services.db, "exams", examId), (snap) => {
      setExam(snap.exists() ? (snap.data() as Exam) : null);
    });
  }, [services, examId]);

  useEffect(() => {
    if (!exam) return;
    const tick = () => setRemainingSeconds(Math.max(0, Math.floor((exam.endsAt - Date.now()) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [exam]);

  useEffect(() => {
    if (!services || !user || !attemptId) return;

    const ref = doc(services.db, "attempts", attemptId);

    getDoc(ref).then(async (snap) => {
      if (snap.exists()) return;

      const seed: ExamAttempt = {
        id: attemptId,
        examId,
        studentId: user.uid,
        startedAt: now(),
        status: "in_progress",
        answers: {},
        violationCount: 0,
        proctoringScore: 100,
      };

      await setDoc(ref, seed, { merge: true });
    });

    return onSnapshot(ref, (snap) => {
      setAttempt(snap.exists() ? (snap.data() as ExamAttempt) : null);
      setAnswers((snap.data() as ExamAttempt | undefined)?.answers ?? {});
    });
  }, [services, user, attemptId, examId]);

  const { isFrozen, freezeMessage, violationCount, videoRef } = useExamProctoring({ exam, attempt, uid: user?.uid ?? "" });
  const theme = useExamRiskTheme(violationCount);

  async function saveAnswer(questionId: string, optionIndex: number) {
    if (!services || !attemptId || !attempt) return;
    const next = { ...answers, [questionId]: optionIndex };
    setAnswers(next);
    await updateDoc(doc(services.db, "attempts", attemptId), { answers: next, updatedAt: now() });
  }

  async function submitAttempt(manual = true) {
    if (!services || !attemptId || !attempt || !exam) return;

    const score = exam.questions.reduce((acc, question) => {
      const selected = answers[question.id];
      if (selected === question.correctOptionIndex) return acc + question.marks;
      if (typeof selected === "number") return acc - exam.negativeMarking;
      return acc;
    }, 0);

    await updateDoc(doc(services.db, "attempts", attemptId), {
      score,
      status: manual ? "submitted" : "auto_submitted",
      submittedAt: now(),
      updatedAt: now(),
    });

    toast.success(manual ? "Exam submitted" : "Exam auto-submitted due to violations");
  }

  useEffect(() => {
    if (!exam || !attempt) return;
    if (violationCount >= exam.autoSubmitViolationThreshold && attempt.status === "in_progress") {
      void submitAttempt(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [violationCount, exam?.autoSubmitViolationThreshold, attempt?.status]);

  return (
    <RoleGuard roles={["student"]}>
      <section className={`space-y-4 rounded-3xl border border-border p-4 transition-colors ${theme.shell} min-[1024px]:min-h-[82vh]`}>
        <Card className="sticky top-2 z-20 border-slate-700/70 bg-[#0b1220] text-slate-100">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-3">
            <div className="inline-flex items-center gap-2 text-sm font-medium">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
              </span>
              Recording Active
            </div>
            <div className="text-sm text-slate-300">
              Time Remaining: <span className="font-semibold text-slate-100">{Math.floor(remainingSeconds / 60)}:{String(remainingSeconds % 60).padStart(2, "0")}</span>
            </div>
            <div className="text-xs text-emerald-300">Connectivity Stable</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between gap-3">
              <h1 className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
                {exam?.title ?? "Exam console"}
              </h1>
              <Badge>Live Proctoring</Badge>
            </div>
            <p className="text-sm text-muted">Violations: {violationCount}</p>
            {isFrozen ? <p className="rounded-xl border border-amber-300 bg-amber-50 p-2 text-sm text-amber-800">{freezeMessage ?? "Exam is frozen by teacher"}</p> : null}
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[260px_1fr_340px]">
          <aside className="space-y-2">
            <Card className="border-slate-700/70 bg-[#0b1220] text-slate-100">
              <CardContent className="space-y-2 p-3">
                <p className="text-sm font-semibold">Question Navigator</p>
                <div className="grid grid-cols-5 gap-2">
                  {(exam?.questions ?? []).map((q, i) => {
                    const answered = typeof answers[q.id] === "number";
                    const isFlagged = Boolean(flagged[q.id]);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setFlagged((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                        className={`rounded-lg border px-2 py-1 text-xs ${
                          isFlagged ? "border-amber-400 bg-amber-400/20 text-amber-200" : answered ? "border-emerald-500 bg-emerald-500/20 text-emerald-200" : "border-slate-600 bg-slate-900/50 text-slate-300"
                        }`}
                        title={`Q${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="space-y-3">
            {(exam?.questions ?? []).map((question, index) => (
              <motion.div key={question.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                <CardContent className="space-y-3 p-4">
                  <h2 className="font-medium">Q{index + 1}. {question.prompt}</h2>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                          answers[question.id] === optionIndex
                            ? "border-primary/70 bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => saveAnswer(question.id, optionIndex)} disabled={isFrozen} />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            ))}
            <Scratchpad />
          </div>

          <aside className="space-y-3">
            <StudentHud violationCount={violationCount} isFrozen={isFrozen} />
            <Card>
              <CardContent className="space-y-3 p-4">
                <p className="text-sm text-muted">Live Camera Preview</p>
                <video ref={videoRef} muted playsInline className="aspect-video w-full rounded-xl border border-border bg-black" />
                <Button onClick={() => submitAttempt(true)} disabled={isFrozen || !attempt || attempt.status !== "in_progress"} className="w-full">Submit Exam</Button>
              </CardContent>
            </Card>
            <StudyBuddy />
          </aside>
        </div>
      </section>
    </RoleGuard>
  );
}
