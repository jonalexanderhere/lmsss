import { Injectable } from "@nestjs/common";
import type { RequestUser } from "../common/interfaces/request-user.interface";
import { SupabaseService } from "../common/supabase.service";
import { AIService } from "../ai/ai.service";
import { CreateResultDto } from "./dto/create-result.dto";

@Injectable()
export class ResultsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly aiService: AIService
  ) {}

  async create(user: RequestUser, payload: CreateResultDto) {
    const xpEarned = Math.max(20, Math.round(payload.score * 1.5) - payload.mistakes.length * 5);

    const { data, error } = await this.supabaseService
      .getClient()
      .from("results")
      .insert({
        user_id: user.sub,
        quiz_id: payload.quizId,
        score: payload.score,
        duration: payload.duration,
        mistakes: payload.mistakes,
        xp_earned: xpEarned
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    const analysis = await this.aiService.analyzeScore({
      userId: user.sub,
      resultId: data.id,
      quizId: payload.quizId,
      score: payload.score,
      duration: payload.duration,
      mistakes: payload.mistakes
    });

    return {
      result: data,
      analysis,
      xpEarned
    };
  }
}
