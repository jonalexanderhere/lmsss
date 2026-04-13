import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../common/supabase.service";

const fallbackQuestions = [
  {
    id: "question-1",
    prompt: "Berapa host usable dalam subnet /27?",
    options: ["30", "32", "62", "14"],
    answer: "30"
  },
  {
    id: "question-2",
    prompt: "Protocol routing dinamis yang ringan untuk jaringan kecil adalah?",
    options: ["RIP", "VTP", "ARP", "NAT"],
    answer: "RIP"
  }
];

@Injectable()
export class QuizzesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getQuizAttempt(id: string) {
    const { data } = await this.supabaseService
      .getClient()
      .from("quizzes")
      .select("*, quiz_questions(*)")
      .eq("id", id)
      .maybeSingle();

    if (!data) {
      return {
        id,
        title: "Fallback Subnet Drill",
        timerInMinutes: 15,
        questions: fallbackQuestions.sort(() => Math.random() - 0.5)
      };
    }

    return {
      ...data,
      questions: (data.quiz_questions ?? []).sort(() => Math.random() - 0.5)
    };
  }
}
