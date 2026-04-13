import { Shell } from "@/components/layout/shell";
import { requireRole } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromotionTool } from "@/modules/dashboard/promotion-tool";
import { createClient } from "@/lib/supabase/server";

export default async function TeacherPromotionPage() {
  await requireRole(["teacher"]);
  const supabase = await createClient();

  // Get student distribution
  const { data: students } = await supabase
    .from("users")
    .select("grade, class_name")
    .eq("role", "student");

  const classes = ["TJKT 1", "TJKT 2", "TJKT 3"];
  const grades = ["X", "XI", "XII"];

  const stats = grades.map(g => ({
    grade: g,
    counts: classes.map(c => ({
      name: c,
      count: students?.filter(s => s.grade === g && s.class_name === c).length || 0
    }))
  }));

  return (
    <Shell role="teacher">
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Batch Promotion Tool</h1>
          <p className="text-muted-foreground">Naikkan kelas siswa secara massal sesuai struktur kelas TJKT.</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map(s => (
            <Card key={s.grade} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <GraduationCap className="h-12 w-12" />
              </div>
              <CardHeader>
                <CardTitle>Kelas {s.grade}</CardTitle>
                <CardDescription>Total: {s.counts.reduce((a, b) => a + b.count, 0)} Siswa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {s.counts.map(c => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <span>{c.name}</span>
                    <Badge variant="secondary">{c.count} Siswa</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Promotion Console
            </CardTitle>
            <CardDescription>
              Gunakan panel ini untuk memindahkan siswa dari satu tingkatan ke tingkatan berikutnya (X &rarr; XI &rarr; XII).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {grades.map(g => (
                <div key={g} className="space-y-4">
                  <h3 className="font-semibold text-center py-2 bg-muted rounded">Promote From {g}</h3>
                  <div className="flex flex-col gap-2">
                    {classes.map(c => (
                      <PromotionTool key={`${g}-${c}`} className={c} grade={g} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
