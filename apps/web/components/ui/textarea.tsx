import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-28 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20",
      className
    )}
    ref={ref}
    {...props}
  />
));

Textarea.displayName = "Textarea";
