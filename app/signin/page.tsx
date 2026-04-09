import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <section className="grid min-h-[75vh] place-items-center">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/70 bg-panel/65 p-6 shadow-soft md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(124,58,237,0.26),transparent_38%),radial-gradient(circle_at_88%_10%,rgba(34,211,238,0.15),transparent_40%)]" />
        <div className="relative grid gap-8 md:grid-cols-[1fr_420px] md:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Secure Sign In</p>
            <h1 className="headline-display text-5xl font-black md:text-6xl">Enter your exam workspace.</h1>
            <p className="max-w-lg text-sm text-muted md:text-base">
              Role-aware access for admins, teachers, and students with secure Firebase authentication.
            </p>
          </div>
          <SignInForm />
        </div>
      </div>
    </section>
  );
}
