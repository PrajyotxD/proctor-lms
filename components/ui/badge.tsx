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
    default: "border-primary/30 bg-primary/10 text-primary",
    secondary: "border-border bg-muted text-foreground",
    success: "border-primary/30 bg-primary/10 text-primary",
    warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    danger: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
    outline: "border-border text-foreground bg-transparent",
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
