import { AITutorPanel } from "@/components/features/ai-tutor-panel";
import { LiveResultsFeed } from "@/components/features/live-results-feed";
import { Shell } from "@/components/layout/shell";
import { requireRole } from "@/lib/auth";
import { RoleDashboard } from "@/modules/dashboard/role-dashboard";
import { getStudentStats } from "@/lib/actions/stats-actions";

export default async function StudentPage() {
  const auth = await requireRole(["student"]);
  const stats = await getStudentStats(auth.user.id);

  return (
    <Shell role="student">
      <div className="space-y-6">
        <RoleDashboard
          title="Student Mission Board"
          subtitle="Pantau progress, weakness area, XP, dan kesiapan ujian dari satu dashboard."
          xp={stats.xp}
          progress={stats.progress}
          metrics={[
            { label: "Quiz Accuracy", value: stats.accuracy },
            { label: "Labs Completed", value: stats.labsCompleted.toString() },
            { label: "Practice Time", value: stats.practiceTime },
            { label: "Mission Status", value: stats.readiness }
          ]}
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white px-2">Registered Missions</h2>
            <div className="glass-card p-12 text-center">
              <p className="text-slate-400">Belum ada kursus yang Anda ikuti. Silakan buka menu Courses untuk mendaftar.</p>
            </div>
          </div>
          <div className="space-y-6">
            <AITutorPanel />
            <LiveResultsFeed userId={auth.user.id} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
