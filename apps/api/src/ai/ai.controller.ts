import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AIService } from "./ai.service";
import { AnalyzeResultDto } from "./dto/analyze-result.dto";
import { TutorChatDto } from "./dto/tutor-chat.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("ai")
@UseGuards(JwtAuthGuard)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post("analyze")
  analyze(@Body() payload: AnalyzeResultDto) {
    return this.aiService.analyzeScore(payload);
  }

  @Post("tutor")
  tutor(@Body() payload: TutorChatDto) {
    return this.aiService.tutorChat(payload);
  }

  @Post("predict")
  predict(@Body() payload: AnalyzeResultDto) {
    return this.aiService.predictReadiness(payload);
  }
}
