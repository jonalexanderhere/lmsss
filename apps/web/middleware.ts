import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPaths = ["/admin", "/teacher", "/student", "/courses", "/quizzes", "/labs"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: any[]) => {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isProtectedRoute) {
     // Fetch profile to check onboarding
     const { data: profile } = await supabase.from("users").select("class_name, role").eq("id", user.id).single();

     if (profile?.role === "student" && !profile?.class_name && !pathname.startsWith("/onboarding")) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
     }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*", "/courses/:path*", "/quizzes/:path*", "/labs/:path*"]
};
