"use client";

import Link from "next/link";
import { Shield, Menu, X, ArrowRight, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/browser";
import { LevelBadge } from "@/components/features/level-badge";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from("users").select("xp, role").eq("id", session.user.id).single()
          .then(({ data }) => setUser({ ...session.user, ...data }));
      }
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [supabase]);

  const dashboardLink = user?.role ? `/${user.role}` : "/login";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-4",
        isScrolled ? "py-3" : "py-5"
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl rounded-[24px] border border-white/10 bg-slate-950/40 px-6 py-3 backdrop-blur-xl transition-all duration-500",
          isScrolled ? "shadow-2xl shadow-teal-500/10 border-white/20 bg-slate-900/60" : ""
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight text-white">NetClassix</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-teal-500/80">LMS Platform</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Courses</Link>
            <Link href="/quizzes" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Quiz Arena</Link>
            <Link href="/labs" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Practice Lab</Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                   <p className="text-[10px] font-bold text-slate-500 uppercase">Current Rank</p>
                   <p className="text-xs font-black text-white">{user.xp || 0} XP</p>
                </div>
                <Link href={dashboardLink}>
                  <LevelBadge xp={user.xp || 0} size="sm" />
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:flex text-slate-400 hover:text-white hover:bg-white/5">
                    Login
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-6 rounded-xl shadow-lg shadow-teal-500/20">
                    Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-4 pb-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <Link href="/courses" className="block text-sm font-medium text-slate-400 hover:text-white py-2">Courses</Link>
            <Link href="/quizzes" className="block text-sm font-medium text-slate-400 hover:text-white py-2">Quiz Arena</Link>
            <Link href="/labs" className="block text-sm font-medium text-slate-400 hover:text-white py-2">Practice Lab</Link>
            {!user && (
              <div className="pt-2">
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-white/5 mb-2">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
