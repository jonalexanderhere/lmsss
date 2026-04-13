import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class SubmitQuizDto {
  @IsString()
  quizId!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  score!: number;

  @IsNumber()
  @Min(0)
  duration!: number;

  @IsArray()
  mistakes!: string[];

  @IsOptional()
  @IsArray()
  answers?: Array<{ questionId: string; answer: string }>;
}
