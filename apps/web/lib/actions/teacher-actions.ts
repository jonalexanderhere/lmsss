"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const overview = formData.get("overview") as string;
  const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");

  const { data, error } = await supabase.from("courses").insert({
    title,
    category,
    overview,
    slug,
    published: true
  }).select().single();

  if (error) throw new Error(error.message);
  revalidatePath("/teacher/management/courses");
  return data;
}

export async function createLesson(formData: FormData) {
  const supabase = await createClient();
  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const content = formData.get("content") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const orderIndex = parseInt(formData.get("orderIndex") as string || "0");

  const { data, error } = await supabase.from("lessons").insert({
    course_id: courseId,
    title,
    type,
    content,
    video_url: videoUrl,
    order_index: orderIndex
  }).select().single();

  if (error) throw new Error(error.message);
  revalidatePath(`/teacher/management/courses/${courseId}`);
  return data;
}

export async function createQuiz(formData: FormData) {
  const supabase = await createClient();
  const lessonId = formData.get("lessonId") as string;
  const title = formData.get("title") as string;
  const timer = parseInt(formData.get("timer") as string || "15");
  const isExam = formData.get("isExam") === "true";

  const { data, error } = await supabase.from("quizzes").insert({
    lesson_id: lessonId,
    title,
    timer_in_minutes: timer,
    is_exam: isExam
  }).select().single();

  if (error) throw new Error(error.message);
  revalidatePath(`/teacher/management/courses`);
  return data;
}

export async function promoteClass(className: string, currentGrade: string) {
  const supabase = await createClient();
  
  let nextGrade = "";
  if (currentGrade === "X") nextGrade = "XI";
  else if (currentGrade === "XI") nextGrade = "XII";
  else if (currentGrade === "XII") nextGrade = "Graduated";

  if (!nextGrade) throw new Error("Invalid grade promotion.");

  const { error } = await supabase
    .from("users")
    .update({ grade: nextGrade, status: nextGrade === "Graduated" ? "graduated" : "active" })
    .match({ class_name: className, grade: currentGrade, role: 'student' });

  if (error) throw new Error(error.message);
  revalidatePath("/teacher/management/promotion");
  return { success: true };
}
