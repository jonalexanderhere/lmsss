"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createTeacherAccount(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    throw new Error("Semua field harus diisi.");
  }

  const supabaseAdmin = createAdminClient();

  // 1. Create user in Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      role: "teacher"
    }
  });

  if (authError) {
    throw new Error(`Gagal membuat akun auth: ${authError.message}`);
  }

  // 2. Insert into public.users (usually handled by trigger, but we ensure it)
  const { error: dbError } = await supabaseAdmin.from("users").upsert({
    id: authData.user.id,
    name,
    email,
    role: "teacher"
  });

  if (dbError) {
    // Cleanup auth user if DB sync fails
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    throw new Error(`Gagal menyimpan data user: ${dbError.message}`);
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function getAllUsers() {
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
