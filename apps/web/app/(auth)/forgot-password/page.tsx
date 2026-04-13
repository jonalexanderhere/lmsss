"use client";

import { useState, useTransition } from "react";
import { Shield, Mail, ArrowLeft, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Link reset password telah dikirim ke email Anda. Silakan cek inbox/spam." });
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-20 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_50%)]" />
      
      <Card className="w-full max-w-md border-white/10 bg-slate-950/70 backdrop-blur-xl relative z-10 shadow-2xl shadow-teal-500/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-black text-white italic">LUPA PASSWORD?</CardTitle>
          <CardDescription>
            Masukkan email Anda untuk menerima link pemulihan akun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                type="email"
                placeholder="email@sekolah.sch.id"
                className="pl-10 bg-white/5 border-white/10 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {message && (
              <p className={cn(
                "text-sm font-medium p-3 rounded-xl border",
                message.type === "success" ? "bg-teal-500/10 border-teal-500/20 text-teal-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              )}>
                {message.text}
              </p>
            )}

            <Button className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-slate-950 font-black rounded-xl" disabled={isPending}>
              {isPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : "KIRIM LINK RECOVERY"}
            </Button>

            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-white transition-colors pt-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Login
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
