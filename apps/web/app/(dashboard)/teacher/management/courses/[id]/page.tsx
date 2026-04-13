import { Shell } from "@/components/layout/shell";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Video, FileText, Layout, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddLessonModal } from "@/modules/courses/add-lesson-modal";
import { AddQuizModal } from "@/modules/courses/add-quiz-modal";

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["teacher"]);
  const { id } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*, lessons(*, quizzes(*))")
    .eq("id", id)
    .single();

  if (!course) return <div>Course not found.</div>;

  return (
    <Shell role="teacher">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground">{course.category} &bull; Manage lessons and exams for this module.</p>
          </div>
          <div className="flex gap-2">
             <AddLessonModal courseId={id} />
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Curriculum Structure</CardTitle>
            <CardDescription>Daftar materi dan ujian yang tersedia untuk siswa.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {course.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => (
                <div key={lesson.id} className="group border rounded-lg p-4 hover:border-primary/30 hover:bg-muted/5 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        {lesson.type === 'video' ? <Video className="h-5 w-5 text-blue-500" /> : <FileText className="h-5 w-5 text-emerald-500" />}
                      </div>
                      <div>
                        <h4 className="font-semibold">{lesson.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="capitalize text-[10px]">{lesson.type}</Badge>
                          {lesson.video_url && <span className="flex items-center gap-1 text-blue-500"><Video className="h-3 w-3" /> Attached</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <AddQuizModal lessonId={lesson.id} existingQuiz={lesson.quizzes?.[0]} />
                    </div>
                  </div>
                  
                  {lesson.quizzes && lesson.quizzes.length > 0 && (
                    <div className="mt-4 ml-13 flex items-center gap-2 pl-12 border-l-2 border-dashed border-muted ml-5">
                       <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                         Quiz: {lesson.quizzes[0].title}
                       </Badge>
                    </div>
                  )}
                </div>
              ))}
              
              {(!course.lessons || course.lessons.length === 0) && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  Belum ada materi. Klik "Add Lesson" untuk mulai mengisi.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
