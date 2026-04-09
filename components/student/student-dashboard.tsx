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
        <Card className="relative overflow-hidden rounded-2xl border-slate-700/40 bg-gradient-to-br from-slate-900 to-slate-950 dark:border-slate-700/40 dark:from-slate-900 dark:to-slate-950">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.15),transparent_50%)]" />
          <CardContent className="relative space-y-4 p-8">
            <Badge className="w-fit border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              Student Portal
            </Badge>
            <div>
              <h1 className="text-5xl font-bold mb-2 text-slate-50">Student Workspace</h1>
              <p className="text-lg text-slate-400">
                Upcoming exams, previous attempts, and proctoring outcomes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Verification Card */}
        <StudentVerificationCard />

        {/* Stats Grid - Bento Style */}
        <div className="grid gap-5 sm:grid-cols-3">
          <Card className="group relative overflow-hidden rounded-lg border-slate-700/40 bg-slate-800/40 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <CardContent className="relative space-y-3 p-6">
              <div className="inline-flex rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-2.5 text-cyan-400">
                <CalendarClock size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Upcoming</p>
                <p className="text-4xl font-bold tracking-tight text-slate-100">{upcoming.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden rounded-lg border-slate-700/40 bg-slate-800/40 backdrop-blur-sm hover:border-green-500/50 hover:bg-slate-800/60 transition-all">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <CardContent className="relative space-y-3 p-6">
              <div className="inline-flex rounded-lg border border-green-500/30 bg-green-500/10 p-2.5 text-green-400">
                <CheckCircle2 size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Attempts</p>
                <p className="text-4xl font-bold tracking-tight text-slate-100">{attempts.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden rounded-lg border-slate-700/40 bg-slate-800/40 backdrop-blur-sm hover:border-blue-500/50 hover:bg-slate-800/60 transition-all">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <CardContent className="relative space-y-3 p-6">
              <div className="inline-flex rounded-lg border border-blue-500/30 bg-blue-500/10 p-2.5 text-blue-400">
                <ShieldAlert size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Avg Score</p>
                <p className="text-4xl font-bold tracking-tight text-slate-100">
                  {attempts.length ? Math.round(attempts.reduce((acc, cur) => acc + cur.proctoringScore, 0) / attempts.length) : 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Exams Section */}
        <Card className="rounded-lg border-slate-700/40 bg-slate-800/40 backdrop-blur-sm">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-100">Upcoming Exams</h2>
              <Badge className="text-xs border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                {upcoming.length} scheduled
              </Badge>
            </div>

            {!profile?.verifiedAt && (
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                <p className="text-sm font-medium text-yellow-200">
                  Complete verification above before taking exams
                </p>
              </div>
            )}

            <div className="space-y-3">
              {upcoming.map((exam) => (
                <Link
                  key={exam.id}
                  href={profile?.verifiedAt ? `/exam/${exam.id}` : "#"}
                  className="group block rounded-lg border border-slate-700/40 bg-slate-900/50 p-5 transition-all hover:border-cyan-500/50 hover:bg-slate-900/70 dark:border-slate-700/60 dark:bg-slate-800/30 dark:hover:border-cyan-500/50 dark:hover:bg-slate-800/60"
                  onClick={(e) => {
                    if (!profile?.verifiedAt) e.preventDefault();
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {exam.title}
                      </p>
                      <p className="text-sm text-slate-400 flex items-center gap-2">
                        <CalendarClock size={14} />
                        {new Date(exam.startsAt).toLocaleString()}
                      </p>
                    </div>
                    {profile?.verifiedAt && (
                      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors group-hover:border-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-200">
                        Start Exam →
                      </div>
                    )}
                  </div>
                </Link>
              ))}
              {upcoming.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-700 bg-slate-800/30 p-8 text-center">
                  <p className="text-sm text-slate-400">No upcoming exams scheduled</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </RoleGuard>
  );
}
