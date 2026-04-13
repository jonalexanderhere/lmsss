import { Module } from "@nestjs/common";
import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";
import { SupabaseService } from "../common/supabase.service";

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, SupabaseService]
})
export class CoursesModule {}
