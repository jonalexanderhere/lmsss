import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
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
