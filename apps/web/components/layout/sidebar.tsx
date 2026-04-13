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
    <aside className="hidden w-72 shrink-0 rounded-[32px] border border-white/10 bg-black/20 p-6 backdrop-blur-xl lg:block">
      <div className="space-y-3">
        <Badge className="bg-teal-400/10 text-teal-200">NetClassix</Badge>
        <div>
          <h1 className="text-2xl font-semibold">TJKT Control Deck</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            LMS modern untuk networking, cybersecurity, dan sysadmin.
          </p>
        </div>
      </div>
      <nav className="mt-8 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
            )}
            href={href}
            key={href}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-8 rounded-3xl border border-teal-400/20 bg-teal-400/10 p-4 text-sm">
        <p className="font-medium text-teal-100 capitalize">Signed in as {role}</p>
        <p className="mt-2 text-teal-50/80">
          Dashboard menyesuaikan RBAC dan insight peran secara otomatis.
        </p>
      </div>
    </aside>
  );
}
