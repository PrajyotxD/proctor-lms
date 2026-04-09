import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "success" | "warning" | "danger" | "outline";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}) {
  const styles: Record<Variant, string> = {
    default: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    secondary: "border-slate-600 bg-slate-700 text-slate-100",
    success: "border-green-500/30 bg-green-500/10 text-green-300 dark:text-green-400",
    warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300 dark:text-yellow-400",
    danger: "border-red-500/30 bg-red-500/10 text-red-300 dark:text-red-400",
    outline: "border-slate-600 text-slate-300 bg-transparent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
