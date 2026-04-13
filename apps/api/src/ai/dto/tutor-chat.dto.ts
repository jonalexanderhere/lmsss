import { IsString, MaxLength } from "class-validator";

export class TutorChatDto {
  @IsString()
  @MaxLength(1000)
  message!: string;
}
