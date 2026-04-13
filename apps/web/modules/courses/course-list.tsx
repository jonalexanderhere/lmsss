import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { previewCourses } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function CourseList() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {previewCourses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <Badge className="w-fit">{course.category}</Badge>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>
              {course.lessons} lesson, {course.labs} lab, fokus praktik nyata.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={course.progress} />
            <Button asChild className="w-full" variant="secondary">
              <Link href={`/courses/${course.slug}`}>
                Open Course
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
