import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SupabaseService } from "../common/supabase.service";
import { AnalyzeResultDto } from "./dto/analyze-result.dto";
import { TutorChatDto } from "./dto/tutor-chat.dto";

type AnalysisResponse = {
  level: string;
  weakness: string;
  recommendation: string;
  next_step: string;
};

@Injectable()
export class AIService {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService
  ) {}

  private async callOpenRouter(messages: any[]) {
    const apiKey = this.configService.get<string>("OPENROUTER_API_KEY");
    const model = "nvidia/nemotron-3-super-120b-a12b:free";

    if (!apiKey) {
      return null;
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          model, 
          messages,
          reasoning: { enabled: true }
        })
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as any;
      return data.choices?.[0]?.message?.content ?? null;
    } catch (error) {
      console.error("OpenRouter Error:", error);
      return null;
    }
  }

  private heuristicAnalysis(payload: AnalyzeResultDto): AnalysisResponse {
    const weakness =
      payload.mistakes[0] ??
      (payload.score < 70
        ? "Konsep subnetting dan pembacaan routing table belum konsisten."
        : "Perlu penguatan pada troubleshooting skenario multi-segmen.");

    return {
      level:
        payload.score >= 85 ? "Engineer" : payload.score >= 70 ? "Technician" : "Trainee",
      weakness,
      recommendation:
        payload.score >= 85
          ? "Lanjut ke mini-project keamanan jaringan dan monitoring."
          : "Ulangi modul inti lalu kerjakan practical drill bertahap sebelum lanjut.",
      next_step:
        payload.score >= 85
          ? "Masuk ke challenge inter-VLAN routing dan hardening service."
          : "Mulai dari subnetting advanced kemudian lab static routing."
    };
  }

  async analyzeScore(payload: AnalyzeResultDto) {
    const systemPrompt =
      'You are an expert TJKT teacher specializing in networking and cybersecurity education.';
    const userPrompt = `Analyze the following student performance data and provide structured feedback:\n\n- Skill level\n- Weaknesses\n- Recommendations\n- Next learning path\n\nReturn JSON format:\n{\n  "level": "",\n  "weakness": "",\n  "recommendation": "",\n  "next_step": ""\n}\n\nData:\n${JSON.stringify(
      {
        score: payload.score,
        mistakes: payload.mistakes,
        duration: payload.duration
      },
      null,
      2
    )}`;

    const content = await this.callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

    let analysis = this.heuristicAnalysis(payload);

    if (content) {
      try {
        analysis = JSON.parse(content) as AnalysisResponse;
      } catch {
        analysis = this.heuristicAnalysis(payload);
      }
    }

    if (payload.resultId) {
      await this.supabaseService.getClient().from("ai_analysis").insert({
        user_id: payload.userId,
        result_id: payload.resultId,
        level: analysis.level,
        feedback: analysis.recommendation,
        weakness: analysis.weakness,
        next_step: analysis.next_step
      });
    }

    return analysis;
  }

  async tutorChat(payload: TutorChatDto) {
    const content = await this.callOpenRouter([
      {
        role: "system",
        content:
          "You are an expert TJKT teacher specializing in networking and cybersecurity education. Keep answers practical, concise, and grounded in curriculum."
      },
      { role: "user", content: payload.message }
    ]);

    return {
      answer:
        content ??
        "Fokuskan troubleshooting dari layer dasar dulu: cek IP, subnet mask, gateway, lalu verifikasi route dan service yang berjalan."
    };
  }

  async predictReadiness(payload: AnalyzeResultDto) {
    const averagePenalty = payload.mistakes.length * 4 + Math.round(payload.duration / 120);
    const readinessScore = Math.max(40, Math.min(98, payload.score - averagePenalty + 18));

    return {
      exam_readiness: readinessScore,
      pkl_readiness: Math.max(35, readinessScore - 6),
      note:
        readinessScore >= 80
          ? "Siswa siap menghadapi evaluasi lanjutan dan mulai diarahkan ke skenario PKL."
          : "Perlu penguatan konsep dasar dan latihan konsisten sebelum evaluasi tinggi."
    };
  }
}
