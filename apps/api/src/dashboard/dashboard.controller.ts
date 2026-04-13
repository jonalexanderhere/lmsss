import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { RequestUser } from "../common/interfaces/request-user.interface";

@Controller("dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("summary")
  getSummary(@Req() request: Request & { user: RequestUser }) {
    return this.dashboardService.getSummary(request.user);
  }
}
