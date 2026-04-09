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
        <Card hover={false}>
          <CardContent className="space-y-4 p-8">
            <Badge>
              Student Portal
            </Badge>
            <div>
              <h1 className="text-5xl font-bold mb-2 text-foreground">Student Workspace</h1>
              <p className="text-lg text-muted-foreground">
                Upcoming exams, previous attempts, and proctoring outcomes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Verification Card */}
        <StudentVerificationCard />

        {/* Stats Grid - Bento Style */}
        <div className="grid gap-5 sm:grid-cols-3">
          <Card className="group">
            <CardContent className="space-y-3 p-6">
              <div className="inline-flex rounded-lg border border-primary/30 bg-primary/10 p-2.5 text-primary">
                <CalendarClock size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Upcoming</p>
                <p className="text-4xl font-bold tracking-tight text-foreground">{upcoming.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group">
            <CardContent className="space-y-3 p-6">
              <div className="inline-flex rounded-lg border border-primary/30 bg-primary/10 p-2.5 text-primary">
                <CheckCircle2 size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Attempts</p>
                <p className="text-4xl font-bold tracking-tight text-foreground">{attempts.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group">
            <CardContent className="space-y-3 p-6">
              <div className="inline-flex rounded-lg border border-primary/30 bg-primary/10 p-2.5 text-primary">
                <ShieldAlert size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Avg Score</p>
                <p className="text-4xl font-bold tracking-tight text-foreground">
                  {attempts.length ? Math.round(attempts.reduce((acc, cur) => acc + cur.proctoringScore, 0) / attempts.length) : 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Exams Section */}
        <Card>
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Upcoming Exams</h2>
              <Badge className="text-xs">
                {upcoming.length} scheduled
              </Badge>
            </div>

            {!profile?.verifiedAt && (
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Complete verification above before taking exams
                </p>
              </div>
            )}

            <div className="space-y-3">
              {upcoming.map((exam) => (
                <Link
                  key={exam.id}
                  href={profile?.verifiedAt ? `/exam/${exam.id}` : "#"}
                  className="group block rounded-lg border border-border bg-muted/30 p-5 transition-all hover:border-primary/30 hover:bg-muted/50"
                  onClick={(e) => {
                    if (!profile?.verifiedAt) e.preventDefault();
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {exam.title}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <CalendarClock size={14} />
                        {new Date(exam.startsAt).toLocaleString()}
                      </p>
                    </div>
                    {profile?.verifiedAt && (
                      <div className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors group-hover:border-primary group-hover:bg-primary/20">
                        Start Exam →
                      </div>
                    )}
                  </div>
                </Link>
              ))}
              {upcoming.length === 0 && (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                  <p className="text-sm text-muted-foreground">No upcoming exams scheduled</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </RoleGuard>
  );
}
