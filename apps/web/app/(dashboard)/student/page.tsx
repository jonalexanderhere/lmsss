import { AITutorPanel } from "@/components/features/ai-tutor-panel";
import { LiveResultsFeed } from "@/components/features/live-results-feed";
import { Shell } from "@/components/layout/shell";
import { requireRole } from "@/lib/auth";
import { RoleDashboard } from "@/modules/dashboard/role-dashboard";
import { getStudentStats } from "@/lib/actions/stats-actions";
import { getAttendanceRecords, getFaceData } from "@/lib/actions/attendance-actions";
import { AttendanceArena } from "@/modules/attendance/attendance-arena";
import { getSubmissionStatus } from "@/lib/actions/user-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Fingerprint, History, Rocket } from "lucide-react";
import { SubmissionTracker } from "@/modules/dashboard/submission-tracker";

export default async function StudentPage() {
  const auth = await requireRole(["student"]);
  const stats = await getStudentStats(auth.user.id);
  
  const faceData = await getFaceData();
  const attendanceRecords = await getAttendanceRecords();
  const submissions = await getSubmissionStatus();
  
  const hasAttendedToday = attendanceRecords.some(r => 
    new Date(r.created_at).toDateString() === new Date().toDateString()
  );

  return (
    <Shell role="student">
      <div className="space-y-10">
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

        <div className="grid gap-10 xl:grid-cols-[1fr_0.8fr]">
          <div className="space-y-10">
            <Tabs defaultValue="missions" className="w-full">
              <TabsList className="bg-white/5 border border-white/10 p-1 h-14 rounded-2xl mb-8">
                <TabsTrigger value="missions" className="rounded-xl h-11 px-6 data-[state=active]:bg-teal-500 data-[state=active]:text-slate-950 uppercase font-black text-[10px] tracking-widest">
                  Active Missions
                </TabsTrigger>
                <TabsTrigger value="status" className="rounded-xl h-11 px-6 data-[state=active]:bg-teal-500 data-[state=active]:text-slate-950 uppercase font-black text-[10px] tracking-widest">
                  Mission Tracker
                </TabsTrigger>
                <TabsTrigger value="absensi" className="rounded-xl h-11 px-6 data-[state=active]:bg-teal-500 data-[state=active]:text-slate-950 uppercase font-black text-[10px] tracking-widest">
                  Attendance Arena
                </TabsTrigger>
              </TabsList>

              <TabsContent value="missions" className="space-y-6">
                <h2 className="text-xl font-bold text-white px-2">Registered Missions</h2>
                <div className="glass-card p-12 text-center">
                  <p className="text-slate-400">Belum ada kursus yang Anda ikuti. Silakan buka menu Courses untuk mendaftar.</p>
                </div>
              </TabsContent>

              <TabsContent value="status" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <SubmissionTracker submissions={submissions} />
              </TabsContent>

              <TabsContent value="absensi" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <AttendanceArena 
                  faceData={faceData} 
                  records={attendanceRecords} 
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-10">
            <AITutorPanel />
            <LiveResultsFeed userId={auth.user.id} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
