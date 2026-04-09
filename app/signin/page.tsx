import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <section className="grid min-h-[75vh] place-items-center">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(6,182,212,0.15),transparent_38%),radial-gradient(circle_at_88%_10%,rgba(59,130,246,0.1),transparent_40%)]" />
        <div className="relative grid gap-8 md:grid-cols-[1fr_420px] md:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Secure Access</p>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight mb-4">
                Enter your <span className="text-cyan-400">workspace</span>
              </h1>
            </div>
            <p className="max-w-lg text-base text-slate-400">
              Role-aware access for admins, teachers, and students with secure Firebase authentication.
            </p>
          </div>
          <SignInForm />
        </div>
      </div>
    </section>
  );
}
