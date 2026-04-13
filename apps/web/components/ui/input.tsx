import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      className={cn(
        "flex h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Input.displayName = "Input";
