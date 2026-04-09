import Link from "next/link";
import { BarChart3, BrainCircuit, ShieldCheck, Sparkles, Eye, Database, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <section className="space-y-20 py-16">
      {/* Hero Section - Supabase Style */}
      <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground text-balance leading-tight">
            Build in a weekend
            <span className="block text-primary">Scale to millions</span>
          </h1>
        </div>
        
        <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
          ProctorAI is the complete exam proctoring platform. Start your project with secure authentication, real-time monitoring, AI-powered integrity checks, and instant reporting.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center pt-6">
          <Link href="/signin">
            <Button className="gap-2 px-8 py-3 text-base font-semibold">
              Start your project
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2 px-8 py-3 text-base font-semibold">
              Request a demo
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Grid - Supabase Bento Style */}
      <div className="space-y-6">
        {/* Top Row - 3 Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Full Stack Database */}
          <Card className="group relative overflow-hidden md:col-span-1">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Database className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Full Stack Proctoring</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Complete exam integrity with secure authentication, real-time monitoring, and AI-powered detection.
                </p>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>100% secure authentication</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Real-time AI monitoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Instant detailed reports</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication */}
          <Card className="group relative overflow-hidden md:col-span-1">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Role-Based Access</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Secure authentication for admins, teachers, and students with enterprise-grade security protocols.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Sample Credentials</div>
                <div className="space-y-1">
                  <code className="block text-xs text-muted-foreground font-mono">admin@school.edu</code>
                  <code className="block text-xs text-muted-foreground font-mono">teacher@school.edu</code>
                  <code className="block text-xs text-muted-foreground font-mono">student@school.edu</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Detection */}
          <Card className="group relative overflow-hidden md:col-span-1">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">AI Integrity Check</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Advanced AI models detect suspicious behavior, tab switches, and unauthorized access instantly.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <div className="text-xs font-semibold text-muted-foreground uppercase">Detection Features</div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">• Face detection & verification</div>
                  <div className="text-xs text-muted-foreground">• Tab switch detection</div>
                  <div className="text-xs text-muted-foreground">• Audio/video analysis</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="group relative overflow-hidden">
            <CardContent className="space-y-6 p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Instant Analytics</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                View detailed reports, student performance metrics, integrity scores, and trends instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden">
            <CardContent className="space-y-6 p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Scalable Infrastructure</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Handle thousands of concurrent exams with enterprise-grade infrastructure and uptime.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trust Section */}
      <div className="text-center space-y-4">
        <p className="text-sm font-medium text-muted-foreground">
          Trusted by fast-growing institutions worldwide
        </p>
      </div>
    </section>
  );
}
