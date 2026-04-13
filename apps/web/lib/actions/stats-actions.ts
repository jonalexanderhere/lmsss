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
    .select("xp, points")
    .eq("id", userId)
    .single();

  // 2. Get Course Progress (Simplified count of joined courses)
  const { count: coursesCount } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  // 3. Get Accuracy (Mocked from results table logic if exists)
  return {
    xp: user?.xp || 0,
    progress: 0, // Needs enrollment logic
    accuracy: "84%",
    labsCompleted: 0,
    practiceTime: "0h",
    readiness: "In Training"
  };
}
