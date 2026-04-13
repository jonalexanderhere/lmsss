import { Shell } from "@/components/layout/shell";
import { requireRole } from "@/lib/auth";
import { RoleDashboard } from "@/modules/dashboard/role-dashboard";

export default async function AdminPage() {
  await requireRole(["admin"]);

  return (
    <Shell role="admin">
      <RoleDashboard
        title="Admin Operations Deck"
        subtitle="Kelola seluruh ekosistem LMS: adopsi user, kualitas modul, stabilitas platform, dan insight sekolah."
        xp={1880}
        progress={95}
        metrics={[
          { label: "Total Users", value: "412" },
          { label: "Courses", value: "24" },
          { label: "API Uptime", value: "99.9%" },
          { label: "AI Usage", value: "1.8k req" }
        ]}
      />
    </Shell>
  );
}
