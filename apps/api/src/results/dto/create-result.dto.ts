import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateResultDto {
  @IsString()
  quizId!: string;

  @IsOptional()
  @IsString()
  lessonId?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  score!: number;

  @IsNumber()
  @Min(0)
  duration!: number;

  @IsArray()
  mistakes!: string[];
}
