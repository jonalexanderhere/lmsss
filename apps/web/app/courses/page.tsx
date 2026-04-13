import { Shell } from "@/components/layout/shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users } from "lucide-react";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function CoursesPage() {
  const supabase = createAdminClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <Shell role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Course Catalog</h1>
          <p className="mt-2 text-slate-400">Pilih modul pembelajaran TJKT untuk mengasah skill Anda.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className="group glass-card h-full transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="flex justify-between">
                    <Badge variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/5">
                      {course.category || "Networking"}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 line-clamp-2 group-hover:text-teal-400 transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration || "2h 30m"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{Math.floor(Math.random() * 50) + 10} Enrolled</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {(courses?.length === 0 || !courses) && (
            <div className="col-span-full py-20 text-center glass-card">
              <BookOpen className="mx-auto h-12 w-12 text-slate-600 mb-4" />
              <p className="text-slate-400">Belum ada kursus yang tersedia saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
