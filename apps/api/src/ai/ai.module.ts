import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AIController } from "./ai.controller";
import { AIService } from "./ai.service";
import { SupabaseService } from "../common/supabase.service";

@Module({
  imports: [ConfigModule],
  controllers: [AIController],
  providers: [AIService, SupabaseService],
  exports: [AIService]
})
export class AIModule {}
