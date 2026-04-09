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
    default: "border-primary/20 bg-primary/10 text-primary",
    secondary: "border-border bg-secondary text-secondary-foreground",
    success: "border-green-600/20 bg-green-600/10 text-green-700 dark:text-green-400",
    warning: "border-orange-600/20 bg-orange-600/10 text-orange-700 dark:text-orange-400",
    danger: "border-red-600/20 bg-red-600/10 text-red-700 dark:text-red-400",
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
