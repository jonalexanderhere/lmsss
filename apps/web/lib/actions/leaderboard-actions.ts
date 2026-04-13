"use server";

import { createClient } from "@/lib/supabase/server";

export async function getLeaderboardData() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .limit(50);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    // Fallback if view doesn't exist or errors
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id, name, xp, class_name, grade")
      .eq("role", "student")
      .order("xp", { ascending: false })
      .limit(50);
      
    if (userError) throw userError;
    return users.map((u, i) => ({ ...u, user_id: u.id, sessions_completed: 0, rank: i + 1 }));
  }

  return data.map((d, i) => ({ ...d, rank: i + 1 }));
}
