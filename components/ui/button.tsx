import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "glass" | "link" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

type Props = {
  className?: string;
  variant?: Variant;
  size?: Size;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-secondary active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
  secondary: "bg-muted text-foreground border border-border hover:bg-muted/80 active:scale-[0.98]",
  ghost: "border border-border bg-transparent text-foreground hover:bg-muted active:scale-[0.98]",
  outline: "border border-primary/30 bg-transparent text-primary hover:bg-primary/10 hover:border-primary active:scale-[0.98]",
  danger: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]",
  glass: "glass hover:bg-card/90 active:scale-[0.98] text-foreground",
  link: "text-primary underline-offset-4 hover:text-secondary hover:underline",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 py-2.5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 focus-visible:outline-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    />
  );
}

// Export buttonVariants for use in other components (like Calendar)
export const buttonVariants = ({ variant = "primary" }: { variant?: Variant }) => {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200",
    variantStyles[variant]
  );
};
