import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export function Shell({
  role,
  children
}: {
  role: "admin" | "teacher" | "student";
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background px-4 py-4 text-foreground lg:px-6">
      <div className="mx-auto flex max-w-7xl gap-4">
        <Sidebar role={role} />
        <main className="min-w-0 flex-1 rounded-[32px] border border-white/10 bg-black/10 p-4 backdrop-blur-xl lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
