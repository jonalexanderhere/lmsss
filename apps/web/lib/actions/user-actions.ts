"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { 
  class_name: string; 
  grade: "X" | "XI" | "XII" | "Graduated"; 
  interest_field?: string;
  name?: string;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("Unauthorized");

  const { error } = await supabase.from("users").update({
    class_name: data.class_name,
    grade: data.grade,
    name: data.name,
    updated_at: new Date().toISOString()
  }).eq("id", userData.user.id);

  if (error) throw new Error(error.message);

  // Sync with Supabase Auth Metadata if name changed
  if (data.name) {
    await supabase.auth.updateUser({
      data: { name: data.name }
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  return { success: true };
}

export async function getSubmissionStatus() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return [];

  // Get all quizzes
  const { data: quizzes } = await supabase.from("quizzes").select("id, title");
  
  // Get all results for this user
  const { data: results } = await supabase
    .from("results")
    .select("quiz_id, score, created_at")
    .eq("user_id", userData.user.id);

  if (!quizzes) return [];

  return quizzes.map(q => {
    const result = results?.find(r => r.quiz_id === q.id);
    return {
      id: q.id,
      title: q.title,
      type: "quiz" as const,
      status: result ? "completed" as const : "pending" as const,
      score: result?.score
    };
  });
}
