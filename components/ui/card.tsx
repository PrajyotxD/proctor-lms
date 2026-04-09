import { cn } from "@/lib/utils";

type CardSize = "default" | "sm";

export function Card({
  className,
  children,
  hover = true,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  size?: CardSize;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card shadow-soft transition-all duration-200",
        hover && "card-hover",
        size === "sm" && "text-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({ 
  className, 
  children,
  size = "default",
}: { 
  className?: string; 
  children: React.ReactNode;
  size?: CardSize;
}) {
  return (
    <div 
      className={cn(
        "flex flex-col space-y-1.5 border-b border-border",
        size === "sm" ? "px-4 py-3" : "px-6 py-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ 
  className, 
  children 
}: { 
  className?: string; 
  children: React.ReactNode;
}) {
  return (
    <h3 className={cn("text-h3 font-semibold leading-none tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ 
  className, 
  children 
}: { 
  className?: string; 
  children: React.ReactNode;
}) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function CardContent({ 
  className, 
  children,
  size = "default",
}: { 
  className?: string; 
  children: React.ReactNode;
  size?: CardSize;
}) {
  return (
    <div 
      className={cn(
        size === "sm" ? "px-4 py-3" : "px-6 py-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardFooter({ 
  className, 
  children,
  size = "default",
}: { 
  className?: string; 
  children: React.ReactNode;
  size?: CardSize;
}) {
  return (
    <div 
      className={cn(
        "flex items-center border-t border-border",
        size === "sm" ? "px-4 py-3" : "px-6 py-5",
        className
      )}
    >
      {children}
    </div>
  );
}
