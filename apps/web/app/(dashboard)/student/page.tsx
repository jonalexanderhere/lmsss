import { AITutorPanel } from "@/components/features/ai-tutor-panel";
import { LiveResultsFeed } from "@/components/features/live-results-feed";
import { Shell } from "@/components/layout/shell";
import { requireRole } from "@/lib/auth";
import { RoleDashboard } from "@/modules/dashboard/role-dashboard";

export default async function StudentPage() {
  const auth = await requireRole(["student"]);

  return (
    <Shell role="student">
      <div className="space-y-6">
        <RoleDashboard
          title="Student Mission Board"
          subtitle="Pantau progress, weakness area, XP, dan kesiapan ujian atau PKL dari satu dashboard."
          xp={730}
          progress={68}
          metrics={[
            { label: "Quiz Accuracy", value: "84%" },
            { label: "Labs Completed", value: "11" },
            { label: "Practice Time", value: "16.3h" },
            { label: "AI Readiness", value: "PKL Ready 72%" }
          ]}
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <AITutorPanel />
          <LiveResultsFeed userId={auth.user.id} />
        </div>
      </div>
    </Shell>
  );
}
