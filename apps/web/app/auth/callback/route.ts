import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect location
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      const user = data.user;
      
      // Sync user profile to public.users table
      try {
        const adminClient = await createAdminClient();
        const { error: upsertError } = await adminClient
          .from("users")
          .upsert({
            id: user.id,
            name: user.user_metadata?.full_name || user.user_metadata?.name || "New User",
            email: user.email!,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            status: "active"
          }, { onConflict: "id" });
        
        if (upsertError) {
          console.error("Profile sync error:", upsertError);
        }
      } catch (err) {
        console.error("Admin client sync error:", err);
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
