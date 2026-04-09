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
        {/* Hero Header - Admin Portal */}
        <Card hover={false}>
          <CardContent className="space-y-6 p-8 md:p-12">
            <div className="flex items-start justify-between flex-col lg:flex-row gap-8">
              <div className="space-y-4 flex-1">
                <Badge>
                  <Shield className="h-3 w-3" />
                  Admin Portal
                </Badge>
                <div>
                  <h1 className="text-5xl font-bold mb-4 text-balance">Admin Control Plane</h1>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    Institution-level role provisioning, subject mapping, and verification governance
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 lg:grid-cols-3">
                <div className="glass rounded-lg px-4 py-3 text-center">
                  <Users className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Users</p>
                </div>
                <div className="glass rounded-lg px-4 py-3 text-center">
                  <BookOpen className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Subjects</p>
                </div>
                <div className="glass rounded-lg px-4 py-3 text-center">
                  <Settings className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Config</p>
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
