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
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/auth/sync-profile`,
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
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {notice ? <p className="text-sm text-teal-200">{notice}</p> : null}
          <Button className="w-full" type="submit">
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            <span className={isPending ? "ml-2" : ""}>
              {mode === "login" ? "Login" : "Register"}
            </span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
