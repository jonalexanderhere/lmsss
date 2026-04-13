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
