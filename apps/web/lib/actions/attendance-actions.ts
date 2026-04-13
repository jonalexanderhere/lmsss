"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveFaceEmbedding(embedding: number[]) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("Unauthorized");

  const { error } = await supabase.from("face_data").upsert({
    user_id: userData.user.id,
    embedding: embedding
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function logAttendance(confidence: number, status: "present" | "late") {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("Unauthorized");

  // Get user class
  const { data: profile } = await supabase.from("users").select("class_name").eq("id", userData.user.id).single();

  const { error } = await supabase.from("attendance").insert({
    user_id: userData.user.id,
    class_name: profile?.class_name || "Unknown",
    status,
    confidence_score: confidence
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  return { success: true };
}
