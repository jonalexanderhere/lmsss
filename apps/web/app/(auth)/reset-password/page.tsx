"use client";

import { useState, useTransition, useEffect } from "react";
import { Shield, Lock, LoaderCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check for session on mount - Supabase handles the recovery link automatically 
  // by creating a session when the user clicks the email link.
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-20 bg-slate-950">
        <Card className="w-full max-w-md border-teal-500/20 bg-slate-950/70 backdrop-blur-xl text-center p-8">
           <CheckCircle2 className="mx-auto h-16 w-16 text-teal-400 mb-6" />
           <h2 className="text-2xl font-black text-white italic mb-2">ACCESS RESTORED!</h2>
           <p className="text-slate-400 mb-6">Password Anda berhasil diperbarui. Mengalihkan ke halaman login...</p>
           <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
             <div className="h-full bg-teal-500 animate-progress-fast" />
           </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-20 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.1),transparent_50%)]" />
      
      <Card className="w-full max-w-md border-white/10 bg-slate-950/70 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">RESET ACCESS KEY</CardTitle>
          <CardDescription>
            Masukkan password baru yang kuat untuk akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">New Password</label>
              <Input
                type="password"
                placeholder="********"
                className="bg-white/5 border-white/10 rounded-xl h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Confirm Password</label>
              <Input
                type="password"
                placeholder="********"
                className="bg-white/5 border-white/10 rounded-xl h-12"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm font-medium p-3 rounded-xl border bg-rose-500/10 border-rose-500/20 text-rose-400">
                {error}
              </p>
            )}

            <Button className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-slate-950 font-black rounded-xl" disabled={isPending}>
              {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "PERBARUI PASSWORD"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
