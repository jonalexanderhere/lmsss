import { Controller, Get, HttpCode, Header } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get("favicon.ico")
  @HttpCode(204)
  getFavicon() {
    return;
  }
}
