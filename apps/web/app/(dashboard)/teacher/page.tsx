import { Shell } from "@/components/layout/shell";
import { requireRole } from "@/lib/auth";
import { RoleDashboard } from "@/modules/dashboard/role-dashboard";
import { getAdminStats } from "@/lib/actions/stats-actions";
import { Gradebook } from "@/modules/teacher/gradebook";
import { getOverallGradebook } from "@/lib/actions/gradebook-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, LayoutDashboard, Settings, UserCheck } from "lucide-react";
import { AttendanceMonitoring } from "@/modules/teacher/attendance-monitoring";
import { getOverallAttendance } from "@/lib/actions/attendance-actions";

export default async function TeacherPage() {
  await requireRole(["teacher"]);
  const stats = await getAdminStats();
  const students = await getOverallGradebook();
  const attendanceLogs = await getOverallAttendance();

  return (
    <Shell role="teacher">
      <div className="space-y-10">
        <RoleDashboard
          title="Teacher Control Room"
          subtitle="Lihat performa kelas, identifikasi siswa yang perlu intervensi, dan pantau efektivitas materi praktikum."
          xp={5000} // Teachers have max XP/Rank feel
          progress={100}
          metrics={[
            { label: "Active Students", value: stats.students.toString() },
            { label: "Total Courses", value: stats.courses.toString() },
            { label: "Avg Session", value: "27m" },
            { label: "Platform Status", value: "Online" }
          ]}
        />

        <Tabs defaultValue="scoreboard" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-1 h-14 rounded-2xl mb-8">
            <TabsTrigger value="scoreboard" className="rounded-xl h-12 px-6 data-[state=active]:bg-teal-500 data-[state=active]:text-slate-950 uppercase font-black text-[10px] tracking-widest">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Student Scoreboard
            </TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-xl h-12 px-6 data-[state=active]:bg-teal-500 data-[state=active]:text-slate-950 uppercase font-black text-[10px] tracking-widest">
              <UserCheck className="mr-2 h-4 w-4" />
              Attendance Protocol
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="rounded-xl h-12 px-6 data-[state=active]:bg-teal-500 data-[state=active]:text-slate-950 text-slate-400 uppercase font-black text-[10px] tracking-widest">
              <Brain className="mr-2 h-4 w-4" />
              Content Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scoreboard" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Gradebook students={students} />
          </TabsContent>

          <TabsContent value="attendance" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AttendanceMonitoring logs={attendanceLogs} />
          </TabsContent>
          
          <TabsContent value="curriculum">
             <div className="glass-card p-20 text-center border-dashed border-2 border-white/5 opacity-50">
               <p className="text-slate-500 font-bold uppercase tracking-widest">Detail insights coming soon</p>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}
