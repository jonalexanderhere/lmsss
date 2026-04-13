import { Module } from "@nestjs/common";
import { QuizzesController } from "./quizzes.controller";
import { QuizzesService } from "./quizzes.service";
import { SupabaseService } from "../common/supabase.service";

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService, SupabaseService]
})
export class QuizzesModule {}
