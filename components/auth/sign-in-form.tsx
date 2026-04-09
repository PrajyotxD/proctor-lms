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
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Shield className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
            Configure Firebase environment variables to enable authentication
          </p>
        </CardContent>
      </Card>
    );
  }

  if (profile && user) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="space-y-6 p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
              <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <Badge variant="success" className="mb-3">
              Session Active
            </Badge>
            <h1 className="text-h2 mb-2">Signed in as {profile.role}</h1>
            <p className="text-body text-muted-foreground">{user.email}</p>
          </div>
          
          <div className="space-y-3">
            <Button className="w-full gap-2" onClick={() => router.push(`/dashboard/${profile.role}`)}>
              <LogIn className="h-4 w-4" />
              Open {profile.role} dashboard
            </Button>
            <Button variant="ghost" className="w-full" onClick={handleSwitchAccount}>
              Sign out to test another account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="space-y-6 p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <Badge variant="default" className="mb-3">
            Secure Access
          </Badge>
          <h1 className="text-h2 mb-2">Welcome back</h1>
          <p className="text-body text-muted-foreground">
            Sign in to access your ProctorAI workspace
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                {...register("email")} 
                type="email" 
                placeholder="you@example.com"
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                {...register("password")} 
                type="password" 
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button disabled={disabled} className="w-full gap-2">
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

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">
            <strong className="font-semibold text-foreground">Demo accounts:</strong> Use the bootstrap script to create admin/teacher/student accounts for testing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
