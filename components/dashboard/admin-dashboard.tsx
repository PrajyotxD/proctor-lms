"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { AdminManagementPanel } from "@/components/dashboard/admin-management-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, BookOpen, Settings } from "lucide-react";

export function AdminDashboard() {
  return (
    <RoleGuard roles={["admin"]}>
      <section className="space-y-8">
        {/* Hero Header - High-Tech Admin Theme */}
        <Card className="relative overflow-hidden rounded-3xl border-border bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950" hover={false}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.2),transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          
          <CardContent className="relative space-y-5 p-8 md:p-12">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <Badge variant="default" className="border-indigo-400/40 bg-indigo-500/15 text-indigo-200">
                  <Shield className="h-3 w-3" />
                  Admin Portal
                </Badge>
                <div>
                  <h1 className="text-display mb-3 text-slate-50">Admin Control Plane</h1>
                  <p className="text-body-lg max-w-2xl text-balance text-slate-300">
                    Institution-level role provisioning, subject mapping, and verification governance
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="hidden lg:flex gap-6">
                <div className="glass-strong rounded-xl px-5 py-3 text-center">
                  <Users className="mx-auto mb-1 h-5 w-5 text-indigo-300" />
                  <p className="text-xs text-slate-400">Users</p>
                </div>
                <div className="glass-strong rounded-xl px-5 py-3 text-center">
                  <BookOpen className="mx-auto mb-1 h-5 w-5 text-emerald-300" />
                  <p className="text-xs text-slate-400">Subjects</p>
                </div>
                <div className="glass-strong rounded-xl px-5 py-3 text-center">
                  <Settings className="mx-auto mb-1 h-5 w-5 text-amber-300" />
                  <p className="text-xs text-slate-400">Config</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management Panel */}
        <AdminManagementPanel />
      </section>
    </RoleGuard>
  );
}
