import { Module } from "@nestjs/common";
import { AIModule } from "../ai/ai.module";
import { SupabaseService } from "../common/supabase.service";
import { ResultsController } from "./results.controller";
import { ResultsService } from "./results.service";

@Module({
  imports: [AIModule],
  controllers: [ResultsController],
  providers: [ResultsService, SupabaseService]
})
export class ResultsModule {}
