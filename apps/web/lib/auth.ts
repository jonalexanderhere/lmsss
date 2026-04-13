import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { type AppRole } from "@/lib/constants";

export interface AuthContext {
  user: User | null;
  role: AppRole | null;
  accessToken: string | null;
}

export interface AuthorizedAuthContext extends AuthContext {
  user: User;
  role: AppRole;
}

export async function getAuthContext(): Promise<AuthContext> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const role = (user?.user_metadata?.role ?? null) as AppRole | null;

  return {
    user,
    role,
    accessToken: session?.access_token ?? null
  };
}

export async function requireRole(roles: AppRole[]): Promise<AuthorizedAuthContext> {
  const auth = await getAuthContext();

  if (!auth.user || !auth.role || !roles.includes(auth.role)) {
    redirect("/login");
  }

  return auth as AuthorizedAuthContext;
}

export { getRolePath } from "@/lib/constants";
