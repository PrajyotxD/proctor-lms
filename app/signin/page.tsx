import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <section className="grid min-h-[75vh] place-items-center">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card p-6 shadow-soft md:p-10">
        <div className="grid gap-8 md:grid-cols-[1fr_420px] md:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Secure Access</p>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight mb-4">
                Enter your <span className="text-primary">workspace</span>
              </h1>
            </div>
            <p className="max-w-lg text-base text-muted-foreground">
              Role-aware access for admins, teachers, and students with secure Firebase authentication.
            </p>
          </div>
          <SignInForm />
        </div>
      </div>
    </section>
  );
}
