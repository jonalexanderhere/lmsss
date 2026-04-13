import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ResultsService } from "./results.service";
import { CreateResultDto } from "./dto/create-result.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import type { RequestUser } from "../common/interfaces/request-user.interface";

@Controller("results")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @Roles("student")
  create(
    @Req() request: Request & { user: RequestUser },
    @Body() payload: CreateResultDto
  ) {
    return this.resultsService.create(request.user, payload);
  }
}
