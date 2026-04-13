import { Injectable } from "@nestjs/common";
import type { RequestUser } from "../common/interfaces/request-user.interface";
import { SupabaseService } from "../common/supabase.service";

@Injectable()
export class DashboardService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getSummary(user: RequestUser) {
    const supabase = this.supabaseService.getClient();

    const [resultsResponse, aiResponse] = await Promise.all([
      supabase.from("results").select("*").eq("user_id", user.sub),
      supabase.from("ai_analysis").select("*").eq("user_id", user.sub).order("created_at", { ascending: false }).limit(1)
    ]);

    const results = resultsResponse.data ?? [];
    const latestAnalysis = aiResponse.data?.[0] ?? null;
    const totalXp = results.reduce((sum, item) => sum + (item.xp_earned ?? 0), 0);
    const averageScore =
      results.length > 0
        ? Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length)
        : 0;

    return {
      role: user.role,
      totalXp,
      averageScore,
      completedQuizzes: results.length,
      latestAnalysis,
      readiness:
        averageScore >= 85 ? "Professional track" : averageScore >= 70 ? "Engineer track" : "Trainee track"
    };
  }
}
