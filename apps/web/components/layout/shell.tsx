"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import Image from "next/image";
import { Search, Bell, UserCircle, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Shell({
  role,
  children
}: {
  role: "admin" | "teacher" | "student";
  children: ReactNode;
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground bg-grid-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
        <Image 
          src="/images/security_branding.png" 
          alt="Security Branding Background" 
          fill 
          className="object-cover"
        />
      </div>
      <div className="mx-auto flex max-w-7xl gap-6 p-4 lg:p-6 relative z-10">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar role={role} />
        </div>
        
        <div className="flex-1 min-w-0 space-y-6">
          <header className="sticky top-6 z-40 flex h-16 items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.02] px-6 backdrop-blur-xl">
            <div className="flex items-center gap-4 text-sm">
              <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden h-10 w-10 p-0 rounded-xl hover:bg-white/10">
                    <Menu className="h-5 w-5 text-slate-400" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-transparent border-none w-80">
                  <div className="p-4 h-full">
                     <Sidebar role={role} onNavigate={() => setIsMobileNavOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-slate-500">NetClassix</span>
                <span className="hidden sm:inline text-slate-700">/</span>
                <span className="font-bold text-white capitalize">{role} Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden h-9 w-64 items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 text-slate-500 lg:flex">
                <Search className="h-4 w-4" />
                <span className="text-xs">Search anything...</span>
              </div>
              <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:bg-white/10">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-teal-500" />
              </button>
              <div className="h-9 w-9 rounded-xl border border-white/10 bg-gradient-to-br from-teal-500 to-blue-500 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                  <UserCircle className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>
          </header>

          <main className="rounded-[32px] border border-white/10 bg-white/[0.01] p-4 backdrop-blur-sm lg:p-8 min-h-[calc(100vh-140px)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

