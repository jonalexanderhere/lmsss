import { notFound } from "next/navigation";
import { BookOpen, PlayCircle, TerminalSquare } from "lucide-react";
import { previewCourses } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const lessons = [
  { id: "lesson-text-1", title: "IP Addressing Architecture", type: "Text", icon: BookOpen },
  { id: "lesson-video-1", title: "CIDR and VLSM Walkthrough", type: "Video", icon: PlayCircle },
  { id: "lesson-lab-1", title: "Lab: Router-on-a-Stick Setup", type: "Practical Lab", icon: TerminalSquare }
];

export default async function CoursePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = previewCourses.find((item) => item.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 lg:px-6">
      <Card className="bg-gradient-to-br from-teal-400/10 via-transparent to-sky-400/10">
        <CardHeader>
          <Badge className="w-fit">{course.category}</Badge>
          <CardTitle className="text-4xl">{course.title}</CardTitle>
          <CardDescription>
            Modul gabungan teori, video, dan praktikum untuk persiapan industri TJKT.
          </CardDescription>
        </CardHeader>
      </Card>
      <section className="grid gap-4 lg:grid-cols-3">
        {lessons.map(({ id, title, type, icon: Icon }) => (
          <Card key={id}>
            <CardHeader>
              <Icon className="h-5 w-5 text-teal-300" />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{type}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Lesson</Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
