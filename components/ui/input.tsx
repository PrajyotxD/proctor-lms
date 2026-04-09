import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 hover:border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}
