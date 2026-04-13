import { Shell } from "@/components/layout/shell";
import { requireRole } from "@/lib/auth";
import { RoleDashboard } from "@/modules/dashboard/role-dashboard";

export default async function TeacherPage() {
  await requireRole(["teacher"]);

  return (
    <Shell role="teacher">
      <RoleDashboard
        title="Teacher Control Room"
        subtitle="Lihat performa kelas, identifikasi siswa yang perlu intervensi, dan pantau efektivitas materi praktikum."
        xp={1240}
        progress={83}
        metrics={[
          { label: "Active Students", value: "148" },
          { label: "Quiz Reviewed", value: "32" },
          { label: "Avg Session", value: "27m" },
          { label: "Exam Readiness", value: "78%" }
        ]}
      />
    </Shell>
  );
}
