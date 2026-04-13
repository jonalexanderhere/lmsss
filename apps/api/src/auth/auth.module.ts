import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { SupabaseService } from "../common/supabase.service";

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SupabaseService],
  exports: [AuthService]
})
export class AuthModule {}
