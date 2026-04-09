"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Role } from "@/lib/types";

export function RoleGuard({
  roles,
  children,
}: {
  roles: Role[];
  children: ReactNode;
}) {
  const router = useRouter();
  const { loading, user, profile, envReady } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!envReady) {
      return;
    }

    if (!user) {
      router.replace("/signin");
      return;
    }

    if (!profile || !roles.includes(profile.role)) {
      router.replace("/dashboard");
    }
  }, [loading, user, profile, roles, router, envReady]);

  if (!envReady) {
    return <p className="text-sm text-amber-600">Firebase config missing in environment.</p>;
  }

  if (loading || !user || !profile || !roles.includes(profile.role)) {
    return <p className="text-sm text-zinc-500">Loading secure workspace...</p>;
  }

  return <>{children}</>;
}
