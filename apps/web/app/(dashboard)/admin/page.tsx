import { Shell } from "@/components/layout/shell";
import { requireRole } from "@/lib/auth";
import { RoleDashboard } from "@/modules/dashboard/role-dashboard";
import { getAdminStats } from "@/lib/actions/stats-actions";
import { CreateTeacherModal } from "@/modules/auth/create-teacher-modal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserPlus, Settings, ShieldCheck } from "lucide-react";

export default async function AdminPage() {
  await requireRole(["admin"]);
  const stats = await getAdminStats();

  return (
    <Shell role="admin">
      <div className="space-y-10">
        <RoleDashboard
          title="Admin Operations Deck"
          subtitle="Kelola seluruh ekosistem LMS: adopsi user, kualitas modul, stabilitas platform, dan insight sekolah."
          xp={1880} // Admin level is static or total systems points
          progress={95}
          metrics={[
            { label: "Total Users", value: stats.users.toString() },
            { label: "Teachers", value: stats.teachers.toString() },
            { label: "Courses", value: stats.courses.toString() },
            { label: "Stability", value: stats.uptime }
          ]}
        />

        <section>
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="h-5 w-5 text-teal-400" />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Quick Operations</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="glass-card p-6 flex items-center justify-between group">
              <div>
                <h3 className="text-lg font-bold text-white">Add Teacher</h3>
                <p className="text-sm text-slate-500">Create new educator account.</p>
              </div>
              <CreateTeacherModal />
            </div>

            <Card className="glass-card border-none">
              <CardHeader className="p-6">
                <CardTitle className="text-lg">System Audit</CardTitle>
                <CardDescription>Review security logs.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card border-none">
              <CardHeader className="p-6">
                <CardTitle className="text-lg">Global Settings</CardTitle>
                <CardDescription>Platform configuration.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </div>
    </Shell>
  );
}
