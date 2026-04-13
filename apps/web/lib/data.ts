export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

export const previewCourses: any[] = [];
export const chartData: any[] = [];
export const quizPreview: QuizItem[] = [];
export const aiPreview = {
  level: "Unranked",
  weakness: "No data yet",
  recommendation: "Mulai pelajari modul pertama Anda.",
  next_step: "Buka menu Courses untuk memulai."
};
