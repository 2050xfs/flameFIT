import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "ghost" | "outline" | "secondary" | "accent"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)] disabled:pointer-events-none disabled:opacity-50 active:scale-95",
                    variant === "default" && "bg-[var(--foreground)] text-[var(--background)] hover:bg-gray-200",
                    variant === "accent" && "bg-linear-to-r from-[var(--primary)] to-[var(--primary-hover)] text-black font-bold hover:opacity-90 shadow-[0_0_20px_rgba(0,240,255,0.3)]",
                    variant === "outline" && "border border-[var(--border)] bg-transparent hover:bg-[var(--card)] hover:text-[var(--foreground)]",
                    variant === "ghost" && "hover:bg-[var(--card)] hover:text-[var(--foreground)]",
                    size === "default" && "h-12 px-6 py-2",
                    size === "sm" && "h-9 rounded-md px-3",
                    size === "lg" && "h-14 rounded-xl px-8 text-base",
                    size === "icon" && "h-10 w-10",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
