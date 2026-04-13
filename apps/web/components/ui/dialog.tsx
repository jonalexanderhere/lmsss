"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 w-full max-w-lg rounded-xl border bg-background p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const DialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  return <>{children}</>;
};

const DialogContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("grid gap-4", className)}>{children}</div>;
};

const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col space-y-1.5 text-center sm:text-left">{children}</div>;
};

const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>;
};

const DialogDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-muted-foreground">{children}</p>;
};

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription };
