"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { CalendarClock, CheckCircle2, ShieldAlert } from "lucide-react";
import { RoleGuard } from "@/components/auth/role-guard";
import { useAuth } from "@/components/auth/auth-provider";
import { getFirebaseServices } from "@/lib/firebase/client";
import { Exam, ExamAttempt } from "@/lib/types";
import { StudentVerificationCard } from "@/components/student/student-verification-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/ui/section-title";

export function StudentDashboard() {
  const { user, profile } = useAuth();
  const services = getFirebaseServices();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!services) {
      return;
    }

    const unsubExams = onSnapshot(collection(services.db, "exams"), (snap) => {
      setExams(snap.docs.map((d) => ({ ...(d.data() as Omit<Exam, "id">), id: d.id })));
    });

    if (!user) {
      return () => unsubExams();
    }

    const unsubAttempts = onSnapshot(
      query(collection(services.db, "attempts"), where("studentId", "==", user.uid)),
      (snap) => {
        setAttempts(snap.docs.map((d) => ({ ...(d.data() as Omit<ExamAttempt, "id">), id: d.id })));
      },
    );

    return () => {
      unsubExams();
      unsubAttempts();
    };
  }, [services, user]);

  const upcoming = useMemo(() => exams.filter((x) => x.startsAt > nowMs), [exams, nowMs]);

  return (
    <RoleGuard roles={["student"]}>
      <section className="space-y-8">
        {/* Hero Header */}
        <Card className="relative overflow-hidden rounded-3xl border-slate-200/60 bg-gradient-to-br from-white to-slate-50 dark:border-slate-700/40 dark:from-slate-900 dark:to-slate-800">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.12),transparent_50%)]" />
          <CardContent className="relative space-y-4 p-8">
            <Badge className="w-fit border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
              Student Portal
            </Badge>
            <div>
              <h1 className="text-display mb-2">Student Workspace</h1>
              <p className="text-body text-slate-600 dark:text-slate-400">
                Upcoming exams, previous attempts, and proctoring outcomes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Verification Card */}
        <StudentVerificationCard />

        {/* Stats Grid - Bento Style */}
        <div className="grid gap-5 sm:grid-cols-3">
          <Card className="group relative overflow-hidden rounded-2xl border-slate-200 bg-white transition-all hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800/50">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <CardContent className="relative space-y-3 p-6">
              <div className="inline-flex rounded-xl border border-indigo-200 bg-indigo-50 p-2.5 text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400">
                <CalendarClock size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-caption mb-1">Upcoming Exams</p>
                <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{upcoming.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden rounded-2xl border-slate-200 bg-white transition-all hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800/50">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <CardContent className="relative space-y-3 p-6">
              <div className="inline-flex rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-caption mb-1">Total Attempts</p>
                <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{attempts.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden rounded-2xl border-slate-200 bg-white transition-all hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800/50">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <CardContent className="relative space-y-3 p-6">
              <div className="inline-flex rounded-xl border border-violet-200 bg-violet-50 p-2.5 text-violet-600 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400">
                <ShieldAlert size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-caption mb-1">Avg Proctoring Score</p>
                <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {attempts.length ? Math.round(attempts.reduce((acc, cur) => acc + cur.proctoringScore, 0) / attempts.length) : 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Exams Section */}
        <Card className="rounded-2xl border-slate-200 bg-white dark:border-slate-700/60 dark:bg-slate-800/50">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-heading">Upcoming Exams</h2>
              <Badge variant="secondary" className="text-xs">
                {upcoming.length} scheduled
              </Badge>
            </div>

            {!profile?.verifiedAt && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  ⚠️ Complete verification above before taking exams
                </p>
              </div>
            )}

            <div className="space-y-3">
              {upcoming.map((exam) => (
                <Link
                  key={exam.id}
                  href={profile?.verifiedAt ? `/exam/${exam.id}` : "#"}
                  className="group block rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/30 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800/60"
                  onClick={(e) => {
                    if (!profile?.verifiedAt) e.preventDefault();
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-subheading group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {exam.title}
                      </p>
                      <p className="text-caption flex items-center gap-2">
                        <CalendarClock size={14} />
                        {new Date(exam.startsAt).toLocaleString()}
                      </p>
                    </div>
                    {profile?.verifiedAt && (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors group-hover:border-indigo-300 group-hover:bg-indigo-50 group-hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:border-indigo-500/50 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-300">
                        Start Exam →
                      </div>
                    )}
                  </div>
                </Link>
              ))}
              {upcoming.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/30">
                  <p className="text-body text-slate-500 dark:text-slate-400">No upcoming exams scheduled</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </RoleGuard>
  );
}
