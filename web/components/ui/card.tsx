import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "outline";
}

export function Card({ className, variant = "glass", ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl p-6 transition-all duration-300",
                variant === "glass" && "glass card-hover border border-[var(--border)]",
                variant === "default" && "bg-[var(--card)] border border-[var(--border)]",
                variant === "outline" && "bg-transparent border border-[var(--border)]",
                className
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn("font-semibold leading-none tracking-tight text-lg", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("", className)} {...props} />;
}
