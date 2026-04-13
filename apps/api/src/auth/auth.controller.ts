import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { SyncProfileDto } from "./dto/sync-profile.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import type { RequestUser } from "../common/interfaces/request-user.interface";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sync-profile")
  syncProfile(@Body() payload: SyncProfileDto) {
    return this.authService.syncProfile(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() request: Request & { user: RequestUser }) {
    return this.authService.getCurrentProfile(request.user);
  }
}
