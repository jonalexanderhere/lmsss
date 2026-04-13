import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class AnalyzeResultDto {
  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  resultId?: string;

  @IsOptional()
  @IsString()
  quizId?: string;

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
