"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, AlertTriangle, Eye, Monitor, Sparkles, UserCheck, Zap, Clock } from "lucide-react";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { useAuth } from "@/components/auth/auth-provider";
import { getFirebaseServices } from "@/lib/firebase/client";
import { ExamAttempt, ProctorIncident } from "@/lib/types";
import { now } from "@/lib/utils";
import { TeacherExamBuilder } from "@/components/teacher/teacher-exam-builder";
import { TeacherAnalytics } from "@/components/charts/teacher-analytics";
import { TeacherGazeHeatmap } from "@/components/teacher/teacher-gaze-heatmap";
import { CheatingPrediction } from "@/components/teacher/cheating-prediction";
import { ManualGradingPanel } from "@/components/teacher/manual-grading-panel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";

export function TeacherDashboard() {
  const services = getFirebaseServices();
  const { profile } = useAuth();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [incidents, setIncidents] = useState<ProctorIncident[]>([]);
  const [matrixMode, setMatrixMode] = useState(false);

  useEffect(() => {
    if (!services) {
      return;
    }

    const unsubAttempts = onSnapshot(collection(services.db, "attempts"), (snap) => {
      setAttempts(snap.docs.map((d) => ({ ...(d.data() as Omit<ExamAttempt, "id">), id: d.id })));
    });

    const unsubIncidents = onSnapshot(query(collection(services.db, "incidents"), orderBy("createdAt", "desc")), (snap) => {
      setIncidents(snap.docs.slice(0, 40).map((d) => ({ ...(d.data() as Omit<ProctorIncident, "id">), id: d.id })));
    });

    return () => {
      unsubAttempts();
      unsubIncidents();
    };
  }, [services]);

  const highRiskCount = useMemo(() => attempts.filter((x) => x.violationCount >= 3).length, [attempts]);
  const activeAttempts = useMemo(() => attempts.filter((x) => x.status === "in_progress"), [attempts]);
  const incidentByStudent = useMemo(() => {
    const map = new Map<string, ProctorIncident[]>();
    for (const incident of incidents) {
      const list = map.get(incident.studentId) ?? [];
      list.push(incident);
      map.set(incident.studentId, list);
    }
    return map;
  }, [incidents]);

  async function freezeAttempt(attempt: ExamAttempt) {
    if (!services || !profile) return;
    await updateDoc(doc(services.db, "attemptControls", attempt.id), {
      frozen: true,
      message: "Exam temporarily frozen by teacher",
      updatedAt: now(),
      updatedBy: profile.uid,
    });
    toast.warning(`Exam frozen for ${attempt.studentId}`);
  }

  async function warnAttempt(attempt: ExamAttempt) {
    if (!services || !profile) return;
    await updateDoc(doc(services.db, "attemptControls", attempt.id), {
      frozen: false,
      message: "Warning: suspicious behavior detected. Stay focused on exam.",
      updatedAt: now(),
      updatedBy: profile.uid,
    });
    toast.message(`Warning sent to ${attempt.studentId}`);
  }

  return (
    <RoleGuard roles={["teacher"]}>
      <section className="space-y-8">
        {/* War Room Header */}
        <Card className="relative overflow-hidden border-slate-700/40 bg-gradient-to-br from-slate-900 to-slate-950" hover={false}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.15),transparent_50%)]" />
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4 p-8">
            <div className="space-y-3">
              <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300">Teacher Control Center</Badge>
              <h1 className="text-5xl font-bold text-slate-50">Command Center</h1>
              <p className="text-balance text-base text-slate-300">
                Realtime monitoring, analytics, prediction, and exam lifecycle control
              </p>
            </div>
            <Button 
              onClick={() => setMatrixMode((v) => !v)} 
              className="gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
            >
              <Sparkles size={16} />
              {matrixMode ? "Disable" : "Enable"} Matrix Mode
            </Button>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-3">
          <Card className="border-slate-700/40 bg-slate-800/40 backdrop-blur-sm hover:border-green-500/50 hover:bg-slate-800/60 transition-all">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-green-400">
                <Activity size={16} strokeWidth={2.5} />
                Active Attempts
              </div>
              <p className="text-4xl font-bold tracking-tight text-slate-100">{activeAttempts.length}</p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-700/40 bg-slate-800/40 backdrop-blur-sm hover:border-red-500/50 hover:bg-slate-800/60 transition-all">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-red-400">
                <AlertTriangle size={16} strokeWidth={2.5} />
                High Risk
              </div>
              <p className="text-4xl font-bold tracking-tight text-slate-100">{highRiskCount}</p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-700/40 bg-slate-800/40 backdrop-blur-sm hover:border-yellow-500/50 hover:bg-slate-800/60 transition-all">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-yellow-400">
                <Zap size={16} strokeWidth={2.5} />
                Latest Alerts
              </div>
              <p className="text-4xl font-bold tracking-tight text-slate-100">{incidents.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Live Student Matrix + Activity Stream */}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          {/* Student Matrix */}
          <Card className="border-slate-700/40 bg-slate-900/40 text-slate-100 backdrop-blur-sm" hover={false}>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Live Student Matrix</h2>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-xs font-medium text-emerald-300">Live</span>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeAttempts.map((attempt) => {
                  const isHigh = attempt.violationCount >= 3;
                  const trustTone = attempt.proctoringScore >= 80 
                    ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40" 
                    : attempt.proctoringScore >= 60 
                    ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40" 
                    : "bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40";
                  const studentIncidents = incidentByStudent.get(attempt.studentId) ?? [];
                  const tabIssue = studentIncidents.some((x) => x.type === "tab_hidden" || x.type === "window_blur");
                  const faceIssue = studentIncidents.some((x) => x.type === "missing_face" || x.type === "multiple_faces");
                  
                  return (
                    <motion.article 
                      key={attempt.id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`group rounded-xl border p-4 transition-all ${
                        matrixMode && isHigh 
                          ? "border-rose-500/60 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.2)] ring-1 ring-rose-500/30" 
                          : "border-slate-700/60 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900/80"
                      }`}
                    >
                      {/* Mini Webcam Feed */}
                      <div className="relative mb-3 aspect-video overflow-hidden rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                          Webcam Feed
                        </div>
                      </div>
                      
                      {/* Student Info */}
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h4 className="font-semibold">Student {attempt.studentId.slice(0, 8)}</h4>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${trustTone}`}>
                          {attempt.proctoringScore}
                        </span>
                      </div>
                      
                      {/* Status Icons */}
                      <div className="mb-3 flex items-center gap-4 text-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <Eye size={14} className={faceIssue ? "text-rose-400" : "text-emerald-400"} strokeWidth={2.5} />
                          <span className="text-slate-400">Face</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Monitor size={14} className={tabIssue ? "text-rose-400" : "text-emerald-400"} strokeWidth={2.5} />
                          <span className="text-slate-400">Tab</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <UserCheck size={14} className={attempt.violationCount > 0 ? "text-amber-400" : "text-emerald-400"} strokeWidth={2.5} />
                          <span className="text-slate-400">Focus</span>
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          className="flex-1 border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-amber-500/50 hover:text-amber-300" 
                          onClick={() => warnAttempt(attempt)}
                        >
                          Warn
                        </Button>
                        <Button 
                          variant="danger" 
                          className="flex-1 px-3 py-1.5 text-xs" 
                          onClick={() => freezeAttempt(attempt)}
                        >
                          Freeze
                        </Button>
                      </div>
                    </motion.article>
                  );
                })}
                {activeAttempts.length === 0 && (
                  <div className="col-span-full rounded-xl border border-slate-700/50 bg-slate-900/30 p-8 text-center">
                    <p className="text-sm text-slate-400">No active attempts right now</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Stream */}
          <Card className="border-slate-700/40 bg-slate-900/40 text-slate-100 backdrop-blur-sm" hover={false}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Activity Stream</h2>
                <Badge className="border-slate-600/50 bg-slate-800/50 text-slate-300">
                  {incidents.length} events
                </Badge>
              </div>
              
              <div className="max-h-[600px] space-y-2 overflow-auto pr-2 scrollbar-thin scrollbar-track-slate-800/50 scrollbar-thumb-slate-700">
                <AnimatePresence initial={false}>
                  {incidents.map((incident) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group rounded-lg border border-slate-700/50 bg-slate-900/60 p-3 text-sm transition-colors hover:border-slate-600 hover:bg-slate-900/80"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <span className="font-semibold text-slate-200">
                            {incident.studentId.slice(0, 8)}
                          </span>
                          <span className="text-slate-400"> • </span>
                          <span className="text-slate-300">
                            {incident.type.replaceAll("_", " ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock size={12} />
                          {new Date(incident.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {incidents.length === 0 && (
                  <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-6 text-center">
                    <p className="text-sm text-slate-400">No incidents yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Panels */}
        <TeacherGazeHeatmap attempts={activeAttempts} />
        <CheatingPrediction attempts={attempts} incidents={incidents} />
        <TeacherAnalytics attempts={attempts} incidents={incidents} />
        <ManualGradingPanel attempts={attempts} />
        <TeacherExamBuilder />
      </section>
    </RoleGuard>
  );
}
