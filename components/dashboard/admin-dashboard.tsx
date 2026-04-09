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
        {/* Hero Header - Modern Admin Theme */}
        <Card className="relative overflow-hidden rounded-2xl border-slate-700/40 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-slate-50" hover={false}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
          
          <CardContent className="relative space-y-6 p-8 md:p-12">
            <div className="flex items-start justify-between flex-col lg:flex-row gap-8">
              <div className="space-y-4 flex-1">
                <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                  <Shield className="h-3 w-3" />
                  Admin Portal
                </Badge>
                <div>
                  <h1 className="text-5xl font-bold mb-4 text-balance">Admin Control Plane</h1>
                  <p className="text-lg text-slate-300 max-w-2xl">
                    Institution-level role provisioning, subject mapping, and verification governance
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 lg:grid-cols-3">
                <div className="glass-strong rounded-lg px-4 py-3 text-center border border-cyan-500/20">
                  <Users className="mx-auto mb-2 h-5 w-5 text-cyan-400" />
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Users</p>
                </div>
                <div className="glass-strong rounded-lg px-4 py-3 text-center border border-cyan-500/20">
                  <BookOpen className="mx-auto mb-2 h-5 w-5 text-cyan-400" />
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Subjects</p>
                </div>
                <div className="glass-strong rounded-lg px-4 py-3 text-center border border-cyan-500/20">
                  <Settings className="mx-auto mb-2 h-5 w-5 text-cyan-400" />
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Config</p>
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
