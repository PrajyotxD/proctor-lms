"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { loading, profile } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!profile) {
      router.replace("/signin");
      return;
    }

    router.replace(`/dashboard/${profile.role}`);
  }, [loading, profile, router]);

  return <p className="text-sm text-zinc-500">Routing to your dashboard...</p>;
}
