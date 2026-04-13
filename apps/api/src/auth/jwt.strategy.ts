import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { RequestUser } from "../common/interfaces/request-user.interface";

type JwtPayload = {
  sub: string;
  email?: string;
  user_metadata?: {
    name?: string;
    role?: "admin" | "teacher" | "student";
  };
  app_metadata?: {
    role?: "admin" | "teacher" | "student";
  };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>("SUPABASE_JWT_SECRET");
    if (!secret) {
      console.warn("⚠️ JWT_STRATEGY_WARNING: SUPABASE_JWT_SECRET is not defined. Authentication will not work.");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret || "fallback-secret-to-prevent-crash",
      audience: configService.get<string>("JWT_AUDIENCE"),
      issuer: configService.get<string>("JWT_ISSUER")
    });
  }

  validate(payload: JwtPayload): RequestUser {
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.user_metadata?.name,
      role: payload.app_metadata?.role ?? payload.user_metadata?.role ?? "student"
    };
  }
}
