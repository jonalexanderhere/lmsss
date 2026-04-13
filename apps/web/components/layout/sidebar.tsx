import Link from "next/link";
import { Activity, BookOpen, BrainCircuit, LayoutDashboard, Shield, TerminalSquare, Users, TrendingUp, ClipboardCheck, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const studentItems = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/quizzes", label: "Quiz Arena", icon: Activity },
  { href: "/labs", label: "Practice Lab", icon: TerminalSquare },
];

const teacherItems = [
  { href: "/teacher", label: "Control Room", icon: Shield },
  { href: "/teacher/management/courses", label: "Manage Courses", icon: Video },
  { href: "/teacher/management/promotion", label: "Promotion Tool", icon: TrendingUp },
];

const adminItems = [
  { href: "/admin", label: "Admin Deck", icon: Shield },
  { href: "/admin/users", label: "User Management", icon: Users },
];

export function Sidebar({ role }: { role: string }) {
  const navItems = role === 'admin' 
    ? [...adminItems, ...studentItems.filter(i => i.label !== 'Dashboard')] 
    : role === 'teacher' 
    ? [...teacherItems, ...studentItems.filter(i => i.label !== 'Dashboard')]
    : studentItems;

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-6 flex flex-col h-[calc(100vh-48px)] rounded-[32px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">NetClassix</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-teal-500/80">Control Deck</p>
            </div>
          </div>
        </div>

        <nav className="mt-10 flex-1 space-y-1.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300",
                "hover:bg-white/10 hover:text-white text-slate-400"
              )}
              href={href}
              key={href}
            >
              <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="rounded-[24px] bg-gradient-to-br from-teal-500/10 to-blue-500/10 p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              <p className="text-[10px] font-bold uppercase text-teal-400">System Online</p>
            </div>
            <p className="text-xs text-slate-300">
              Logged as <span className="font-bold text-white capitalize">{role}</span>
            </p>
          </div>
          
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10">
            <span>Logout Deck</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
