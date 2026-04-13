"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getAdminStats() {
  const supabase = createAdminClient();
  
  const [
    { count: totalUsers },
    { count: totalCourses },
    { count: totalTeachers },
    { count: totalStudents }
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "teacher"),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "student")
  ]);

  return {
    users: totalUsers || 0,
    courses: totalCourses || 0,
    teachers: totalTeachers || 0,
    students: totalStudents || 0,
    uptime: "99.9%", // Simulated or from a heartbeat table
    aiUsage: "1.2k req" // Simulated
  };
}

export async function getStudentStats(userId: string) {
  const supabase = createAdminClient();
  
  // 1. Get XP and Base Info
  const { data: user } = await supabase
    .from("users")
    .select("xp, points, rank")
    .eq("id", userId)
    .single();

  // 2. Get Lab Progress
  const { data: lab } = await supabase
    .from("practice_lab_runs")
    .select("completed_missions, total_missions, current_mission_status")
    .eq("user_id", userId)
    .single();

  const labsCompleted = lab?.completed_missions || 0;
  const totalLabs = lab?.total_missions || 10;
  const progressPercent = Math.round((labsCompleted / totalLabs) * 100);

  return {
    xp: user?.xp || 0,
    progress: progressPercent,
    accuracy: "84%",
    labsCompleted: labsCompleted,
    totalLabs: totalLabs,
    practiceTime: `${Math.round(labsCompleted * 12)}m`,
    readiness: lab?.current_mission_status || "Belum Memulai Lab"
  };
}
