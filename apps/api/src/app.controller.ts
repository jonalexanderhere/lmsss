import { Controller, Get, HttpCode } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("favicon.ico")
  @HttpCode(204)
  getFavicon() {
    return;
  }

  @Get()
  getHello() {
    return {
      message: "NetClassix API is Running",
      version: "1.0.0",
      prefix: "/api",
      status: "Superb",
      documentation: "Please use /api prefix for all endpoints"
    };
  }
}
