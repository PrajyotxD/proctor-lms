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
    "bg-cyan-500 text-white shadow-md hover:bg-cyan-600 hover:shadow-lg active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
  secondary: "bg-slate-700 text-slate-100 border border-slate-600 hover:bg-slate-600 hover:border-slate-500 active:scale-[0.98]",
  ghost: "border border-slate-600 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100 active:scale-[0.98]",
  outline: "border border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-[0.98]",
  danger: "bg-red-500/80 text-white shadow-md hover:bg-red-600 hover:shadow-lg active:scale-[0.98]",
  glass: "glass hover:bg-card/90 active:scale-[0.98] text-foreground",
  link: "text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline",
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
