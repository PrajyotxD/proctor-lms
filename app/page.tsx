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
      {/* Hero Section - Conversion Focused */}
      <Card className="relative overflow-hidden rounded-3xl border-slate-700/40 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-slate-50" hover={false}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.4),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.25),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        
        <CardContent className="relative grid gap-12 p-8 md:grid-cols-2 md:gap-16 md:p-16">
          {/* Left: Value Proposition */}
          <div className="flex flex-col justify-center space-y-6">
            <Badge className="w-fit border-indigo-400/30 bg-indigo-500/10 text-indigo-200 backdrop-blur-sm">
              ProctorAI • Enterprise LMS
            </Badge>
            
            <h1 className="headline-display text-[3rem] md:text-[4.5rem]">
              <span className="block text-balance">Secure, Scalable, &</span>
              <span className="block bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                AI-Powered Proctoring
              </span>
            </h1>
            
            <p className="text-balance text-lg leading-relaxed text-slate-300 md:text-xl">
              Production-grade exam integrity platform for institutions running high-stakes online assessments.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/signin">
                <Button className="gap-2 px-6 py-3 text-base">
                  Get Started <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="glass" className="gap-2 px-6 py-3 text-base text-slate-100">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Live Student Matrix Mock */}
          <div className="flex flex-col justify-center">
            <div className="glass-strong space-y-4 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Student Matrix</p>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-xs text-emerald-300">Live</span>
                </div>
              </div>
              
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: "S-101", trust: 92, state: "Focused", status: "safe" },
                  { name: "S-144", trust: 68, state: "Tab switched", status: "warning" },
                  { name: "S-076", trust: 81, state: "Face detected", status: "safe" },
                  { name: "S-219", trust: 49, state: "Multiple alerts", status: "danger" },
                ].map((student) => (
                  <div key={student.name} className="group rounded-xl border border-slate-700/60 bg-slate-900/70 p-4 backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-900/90">
                    {/* Mini Webcam Preview */}
                    <div className="mb-3 aspect-video rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900" />
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-100">{student.name}</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        student.trust >= 80 
                          ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30" 
                          : student.trust >= 60 
                          ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30" 
                          : "bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/30"
                      }`}>
                        {student.trust}
                      </span>
                    </div>
                    
                    <p className="mt-2 text-xs text-slate-400">{student.state}</p>
                    
                    {/* Status Icons */}
                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Eye size={12} className={student.status === "danger" ? "text-rose-400" : "text-emerald-400"} />
                        <span className="text-slate-400">Face</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Monitor size={12} className={student.status === "warning" ? "text-amber-400" : "text-emerald-400"} />
                        <span className="text-slate-400">Tab</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <UserCheck size={12} className={student.status === "safe" ? "text-emerald-400" : "text-amber-400"} />
                        <span className="text-slate-400">Focus</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Grid - Bento Box Layout */}
      <section className="space-y-6">
        <div className="text-center">
          <Badge className="mb-4">Platform Capabilities</Badge>
          <h2 className="text-h1 mb-3">Enterprise-grade modules for integrity</h2>
          <p className="text-muted mx-auto max-w-2xl text-balance">
            Comprehensive exam operations with AI-powered monitoring and real-time analytics
          </p>
        </div>
        
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.slice(0, 4).map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group border-slate-700/40 bg-slate-800/40 text-slate-100 backdrop-blur-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="inline-flex rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-300 transition-all group-hover:border-indigo-400/50 group-hover:bg-indigo-500/20">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold leading-tight">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{feature.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Extended Features */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-h1 mb-3">Operations Intelligence</h2>
          <p className="text-muted mx-auto max-w-2xl text-balance">
            Signal-driven monitoring, evidence capture, and analytics for administrators and educators
          </p>
        </div>
        
        <div className="grid gap-5 md:grid-cols-2">
          {features.slice(4).map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group">
                <CardContent className="space-y-4 p-6">
                  <div className="inline-flex rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary transition-all group-hover:border-primary/40 group-hover:bg-primary/20">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold leading-tight">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{feature.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Tech Stack Badge */}
      <section className="glass rounded-2xl px-8 py-5 text-center">
        <p className="text-sm font-medium text-muted">
          Powered by <span className="font-semibold text-foreground">Next.js 16</span> • <span className="font-semibold text-foreground">Firebase</span> • <span className="font-semibold text-foreground">TensorFlow.js</span>
        </p>
      </section>
    </section>
  );
}
