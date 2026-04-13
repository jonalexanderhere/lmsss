import { Shell } from "@/components/layout/shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Trophy, Timer } from "lucide-react";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function QuizzesPage() {
  const supabase = createAdminClient();
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <Shell role="student">
      <div className="space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">Quiz Arena</h1>
            <p className="mt-2 text-slate-400">Uji pengetahuan Anda dan capai peringkat tertinggi di SMK 1 Liwa.</p>
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-bold text-amber-500 uppercase tracking-wider">Top Rankings Active</span>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes?.map((quiz) => (
            <Link key={quiz.id} href={`/quizzes/${quiz.id}`}>
              <div className="group glass-card p-6 h-full transition-all hover:bg-white/[0.08]">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-teal-500/20 group-hover:text-teal-400 transition-colors">
                    <Activity className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="border-white/10 text-slate-500">
                    {quiz.duration_minutes} Mins
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
                  {quiz.title}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-6">
                  {quiz.description || "Uji pemahaman Anda mengenai topik ini melalui serangkaian pertanyaan strategis."}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Timer className="h-3 w-3" />
                    <span>Limited Time</span>
                  </div>
                  <span className="text-xs font-bold text-teal-400 group-hover:translate-x-1 transition-transform">Start Mission →</span>
                </div>
              </div>
            </Link>
          ))}

          {(quizzes?.length === 0 || !quizzes) && (
            <div className="col-span-full py-20 text-center glass-card">
              <Activity className="mx-auto h-12 w-12 text-slate-600 mb-4" />
              <p className="text-slate-400">Belum ada quiz yang tersedia untuk saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
