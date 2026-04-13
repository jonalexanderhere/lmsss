"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Rocket, CheckCircle2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/browser";
import { updateProfile } from "@/lib/actions/user-actions"; // I'll need to create this

export default function OnboardingPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [className, setClassName] = useState("");
  const [grade, setGrade] = useState("");
  const [interest, setInterest] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className || !grade || !interest) return;

    startTransition(async () => {
      try {
        await updateProfile({
          class_name: className,
          grade: grade as any,
          interest_field: interest
        });
        router.push("/dashboard");
        router.refresh();
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-20 bg-slate-950 overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-xl border-white/10 bg-slate-950/70 backdrop-blur-3xl relative z-10 shadow-2xl border-t-teal-500/40">
        <CardHeader className="text-center pb-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[32px] bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20 shadow-lg shadow-teal-500/5">
            <GraduationCap className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
            FINAL SETUP: INITIATED
          </CardTitle>
          <CardDescription className="text-slate-400 text-base max-w-md mx-auto">
            Selamat datang di NetClassix. Pilihidentitas akademi Anda untuk mulai berlatih di Arena.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Academy Grade</label>
                <Select onValueChange={setGrade} required>
                  <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14 text-white">
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                    <SelectItem value="X">Kelas X (Tingkat Dasar)</SelectItem>
                    <SelectItem value="XI">Kelas XI (Tingkat Lanjut)</SelectItem>
                    <SelectItem value="XII">Kelas XII (Uji Kompetensi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Class Unit</label>
                <Input 
                  placeholder="Contoh: TJKT 1" 
                  className="bg-white/5 border-white/10 rounded-2xl h-14"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-1">Technical Focus (IT Area)</label>
              <Select onValueChange={setInterest} required>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-14 text-white">
                  <SelectValue placeholder="Pilih Spesialisasi" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                  <SelectItem value="Networking">Network Engineering (Cisco/Mikrotik)</SelectItem>
                  <SelectItem value="Cybersecurity">Cyber Warden (Security & Hardening)</SelectItem>
                  <SelectItem value="SystemAdmin">System Architect (Linux & Virtualization)</SelectItem>
                  <SelectItem value="Cloud">Cloud Master (Infrastructure & DevOps)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button 
                className="w-full h-16 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xl font-black rounded-3xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-teal-500/20 group uppercase italic"
                disabled={isPending}
              >
                {isPending ? (
                  <LoaderCircle className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    ENTER THE ARENA
                    <Rocket className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-[0.3em]">
              Identity Secured via NetClassix Protocol v2.5
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
