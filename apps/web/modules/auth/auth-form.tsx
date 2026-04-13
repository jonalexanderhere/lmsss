"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { getRolePath } from "@/lib/constants";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/api-client";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const setSession = useAuthStore((state) => state.setSession);

  const handleGoogleLogin = async () => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback` // Or use standard redirect
      }
    });

    if (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    startTransition(() => {
      void (async () => {
        const supabase = createClient();
        let currentSession: Session | null = null;
        let currentUser: User | null = null;

        if (mode === "register") {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                role
              }
            }
          });

          if (signUpError) {
            setError(signUpError.message);
            return;
          }

          currentSession = signUpData.session;
          currentUser = signUpData.user;

          if (!currentSession || !currentUser) {
            setNotice(
              "Akun berhasil dibuat. Jika email confirmation aktif di Supabase, verifikasi email dulu lalu login."
            );
            return;
          }
        }

        if (!currentSession || !currentUser) {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (signInError || !data.session || !data.user) {
            setError(signInError?.message ?? "Unable to create session");
            return;
          }

          currentSession = data.session;
          currentUser = data.user;
        }

        const resolvedRole =
          (currentUser.user_metadata.role as "admin" | "teacher" | "student" | undefined) ??
          "student";

        await fetch(
          `${API_URL}/api/auth/sync-profile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id: currentUser.id,
              email: currentUser.email ?? email,
              name:
                (currentUser.user_metadata.name as string | undefined) ??
                name ??
                "NetClassix User",
              role: resolvedRole
            })
          }
        ).catch(() => null);

        setSession({
          token: currentSession.access_token,
          role: resolvedRole
        });

        router.push(getRolePath(resolvedRole));
        router.refresh();
      })();
    });
  };

  return (
    <Card className="w-full max-w-md border-white/10 bg-slate-950/70">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Masuk ke NetClassix" : "Daftar akun baru"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Gunakan akun Supabase Auth Anda untuk mengakses dashboard sesuai peran."
            : "Registrasi siswa atau guru dengan metadata role langsung tersimpan di Supabase Auth."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <>
              <Input placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} />
              <p className="text-[10px] text-muted-foreground italic px-2">
                *Pendaftaran publik dikhususkan untuk Siswa. Akun Guru hanya bisa dibuat oleh Admin.
              </p>
            </>
          ) : null}
          <Input
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            value={email}
          />
          <Input
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            value={password}
          />
          {mode === "login" && (
            <div className="flex justify-end px-1">
              <Link href="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-teal-400 transition-colors">
                Lupa Password?
              </Link>
            </div>
          )}
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {notice ? <p className="text-sm text-teal-200">{notice}</p> : null}
          <Button className="w-full" type="submit">
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            <span className={isPending ? "ml-2" : ""}>
              {mode === "login" ? "Login" : "Register"}
            </span>
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-2 text-slate-500">Atau lanjutkan dengan</span>
            </div>
          </div>

          <Button 
            className="w-full bg-white text-slate-950 hover:bg-slate-200" 
            onClick={handleGoogleLogin} 
            type="button"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
