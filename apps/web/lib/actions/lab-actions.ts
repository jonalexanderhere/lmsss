"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateLabProgress(userId: string, missionsCount: number, status: string) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("practice_lab_runs")
    .upsert({
      user_id: userId,
      completed_missions: missionsCount,
      current_mission_status: status,
      scenario: "CLI Master Mission",
      total_missions: 10
    }, {
      onConflict: "user_id"
    })
    .select()
    .single();

  if (error) throw error;
  
  revalidatePath("/student");
  return data;
}

export async function getLabProgress(userId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("practice_lab_runs")
    .select("*")
    .eq("user_id", userId)
    .single();
    
  return data;
}
