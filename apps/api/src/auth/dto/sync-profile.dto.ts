import { IsEmail, IsIn, IsOptional, IsString } from "class-validator";

export class SyncProfileDto {
  @IsString()
  id!: string;

  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsIn(["admin", "teacher", "student"])
  role!: "admin" | "teacher" | "student";

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
