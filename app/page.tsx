import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, Radar, ShieldCheck, Smartphone, Sparkles, Eye, Monitor, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

const features = [
  { icon: ShieldCheck, title: "Zero-Loophole Proctoring", text: "Realtime signals for focus, face presence, orientation, and evidence capture." },
  { icon: BrainCircuit, title: "AI Monitoring", text: "Face checks, cheating prediction, and adaptive risk scoring with explainable alerts." },
  { icon: Radar, title: "Teacher Command Center", text: "Matrix mode, heatmaps, analytics, freeze controls, grading, and alerts in one place." },
  { icon: Smartphone, title: "Cross-Platform", text: "Mobile + desktop parity with responsive, battery-aware proctoring behavior." },
  { icon: BarChart3, title: "Progress Intelligence", text: "Performance trends, proctoring scorecards, and subject-level analytics." },
  { icon: Sparkles, title: "Modern Experience", text: "Premium violet UI, dark/light themes, and polished interactions across flows." },
];

export default function HomePage() {
  return (
    <section className="space-y-16">
      {/* Hero Section - Modern Premium Design */}
      <Card className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 text-foreground" hover={false}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <CardContent className="relative grid gap-12 p-8 md:grid-cols-2 md:gap-16 md:p-16">
          {/* Left: Value Proposition */}
          <div className="flex flex-col justify-center space-y-8">
            <Badge className="w-fit border-cyan-500/30 bg-cyan-500/10 text-cyan-200">
              ProctorAI LMS
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
                Secure Exam
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Proctoring</span>
              </h1>
            </div>
            
            <p className="text-lg text-balance text-slate-300 max-w-lg">
              Enterprise-grade AI-powered proctoring for institutions running high-stakes online assessments with confidence.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/signin">
                <Button className="gap-2 px-6 py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="gap-2 px-6 py-3 text-base border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                  Dashboard →
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Live Monitoring Cards */}
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Live Monitoring</p>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  <span className="text-xs text-green-400">Active</span>
                </div>
              </div>
              
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Student 101", trust: 92, icon: "✓" },
                  { name: "Student 144", trust: 68, icon: "⚠" },
                  { name: "Student 076", trust: 81, icon: "✓" },
                  { name: "Student 219", trust: 49, icon: "✕" },
                ].map((student) => (
                  <div key={student.name} className="group rounded-lg border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm p-4 hover:border-cyan-500/50 hover:bg-slate-900/70 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-slate-100">{student.name}</p>
                      </div>
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        student.trust >= 80 
                          ? "bg-green-500/20 text-green-400" 
                          : student.trust >= 60 
                          ? "bg-yellow-500/20 text-yellow-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {student.trust}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Trust Score</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Grid - Bento Box Layout */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <Badge className="inline-block border-cyan-500/30 bg-cyan-500/10 text-cyan-200">Features</Badge>
          <h2 className="text-4xl font-bold">Enterprise-grade Capabilities</h2>
          <p className="text-slate-400 mx-auto max-w-2xl text-balance">
            Comprehensive exam operations with AI-powered monitoring and real-time analytics
          </p>
        </div>
        
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.slice(0, 4).map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group border-slate-700/40 bg-slate-800/40 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all">
                <CardContent className="space-y-4 p-6">
                  <div className="inline-flex rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-cyan-300 group-hover:border-cyan-400/50 group-hover:bg-cyan-500/20 transition-all">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold leading-tight text-slate-100">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{feature.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Extended Features */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold">Operations Intelligence</h2>
          <p className="text-slate-400 mx-auto max-w-2xl text-balance">
            Signal-driven monitoring, evidence capture, and analytics for administrators and educators
          </p>
        </div>
        
        <div className="grid gap-5 md:grid-cols-2">
          {features.slice(4).map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group border-slate-700/40 bg-slate-800/40 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all">
                <CardContent className="space-y-4 p-6">
                  <div className="inline-flex rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-cyan-300 group-hover:border-cyan-400/50 group-hover:bg-cyan-500/20 transition-all">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold leading-tight text-slate-100">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{feature.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Badge */}
      <section className="glass rounded-xl px-8 py-6 text-center border border-cyan-500/20 bg-cyan-500/5 backdrop-blur">
        <p className="text-sm font-medium text-slate-400">
          Powered by <span className="font-semibold text-cyan-300">Next.js 16</span> • <span className="font-semibold text-cyan-300">Firebase</span> • <span className="font-semibold text-cyan-300">TensorFlow.js</span>
        </p>
      </section>
    </section>
  );
}
