import { Shell } from "@/components/layout/shell";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Video, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function TeacherCoursesPage() {
  await requireRole(["teacher"]);
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*, lessons(id, type)")
    .order("created_at", { ascending: false });

  return (
    <Shell role="teacher">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
            <p className="text-muted-foreground">Kelola kurikulum, video pembelajaran, dan materi UKK.</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600">
            <Link href="/teacher/management/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => (
            <Card key={course.id} className="group hover:shadow-xl transition-all border-emerald-500/10 hover:border-emerald-500/30">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">{course.category}</Badge>
                  {course.published && <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Live</Badge>}
                </div>
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.overview}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course.lessons?.length || 0} Lessons
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    {course.lessons?.filter((l: any) => l.type === 'video').length || 0} Videos
                  </div>
                </div>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href={`/teacher/management/courses/${course.id}`}>
                    Manage Content
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {(!courses || courses.length === 0) && (
            <Card className="col-span-full py-12 border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg">Empty Library</h3>
                <p className="text-muted-foreground max-w-xs">Anda belum membuat materi apapun. Mulai dengan membuat modul baru.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Shell>
  );
}
