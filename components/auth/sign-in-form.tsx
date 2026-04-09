"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Mail, Shield, LogIn } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export function SignInForm() {
  const router = useRouter();
  const { signIn, signOutUser, user, profile, loading, envReady } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const disabled = useMemo(() => submitting || loading || !envReady, [submitting, loading, envReady]);

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      await signIn(data.email, data.password);
      toast.success("Signed in successfully");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSwitchAccount() {
    try {
      await signOutUser();
      toast.success("Signed out. You can now sign in with another account.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign out failed");
    }
  }

  if (!envReady) {
    return (
      <Card className="w-full max-w-md border-yellow-500/20 bg-yellow-500/5">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-500">
            <Shield className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
            Configure Firebase environment variables to enable authentication
          </p>
        </CardContent>
      </Card>
    );
  }

  if (profile && user) {
    return (
      <Card className="w-full max-w-md border-slate-700/40 bg-slate-900/50 backdrop-blur shadow-lg">
        <CardContent className="space-y-6 p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10">
              <Shield className="h-8 w-8 text-green-400" />
            </div>
            <Badge className="mb-3 border-green-500/30 bg-green-500/10 text-green-300">
              Session Active
            </Badge>
            <h2 className="text-2xl font-bold mb-2 text-slate-100">Signed in as {profile.role}</h2>
            <p className="text-sm text-slate-400">{user.email}</p>
          </div>
          
          <div className="space-y-3">
            <Button className="w-full gap-2 bg-cyan-500 hover:bg-cyan-600 text-white" onClick={() => router.push(`/dashboard/${profile.role}`)}>
              <LogIn className="h-4 w-4" />
              Open {profile.role} dashboard
            </Button>
            <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800" onClick={handleSwitchAccount}>
              Sign out to test another account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-slate-700/40 bg-slate-900/50 backdrop-blur shadow-lg">
      <CardContent className="space-y-6 p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10">
            <Lock className="h-8 w-8 text-cyan-400" />
          </div>
          <Badge className="mb-3 border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
            Secure Access
          </Badge>
          <h2 className="text-2xl font-bold mb-2 text-slate-100">Welcome back</h2>
          <p className="text-sm text-slate-400">
            Sign in to access your ProctorAI workspace
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input 
                {...register("email")} 
                type="email" 
                placeholder="you@example.com"
                className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input 
                {...register("password")} 
                type="password" 
                placeholder="••••••••"
                className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button disabled={disabled} className="w-full gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold">
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign in
              </>
            )}
          </Button>
        </form>

        <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
          <p className="text-xs text-slate-400">
            <strong className="font-semibold text-slate-300">Demo accounts:</strong> Use the bootstrap script to create admin/teacher/student accounts for testing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
