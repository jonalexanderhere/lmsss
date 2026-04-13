import { Controller, Get, Param } from "@nestjs/common";
import { QuizzesService } from "./quizzes.service";

@Controller("quizzes")
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get(":id/attempt")
  getAttempt(@Param("id") id: string) {
    return this.quizzesService.getQuizAttempt(id);
  }
}
