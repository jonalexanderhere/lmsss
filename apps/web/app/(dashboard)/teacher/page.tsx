import { Shell } from "@/components/layout/shell";
import { requireRole } from "@/lib/auth";
import { RoleDashboard } from "@/modules/dashboard/role-dashboard";
import { getAdminStats } from "@/lib/actions/stats-actions";

export default async function TeacherPage() {
  await requireRole(["teacher"]);
  const stats = await getAdminStats();

  return (
    <Shell role="teacher">
      <RoleDashboard
        title="Teacher Control Room"
        subtitle="Lihat performa kelas, identifikasi siswa yang perlu intervensi, dan pantau efektivitas materi praktikum."
        xp={1240}
        progress={83}
        metrics={[
          { label: "Active Students", value: stats.students.toString() },
          { label: "Total Courses", value: stats.courses.toString() },
          { label: "Avg Session", value: "27m" },
          { label: "Platform Status", value: "Online" }
        ]}
      />
    </Shell>
  );
}
