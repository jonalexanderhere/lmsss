import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import express from 'express';

let cachedApp: any;

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  
  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>("CORS_ORIGIN") ?? "http://localhost:3000";

  app.enableCors({
    origin: corsOrigin,
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.setGlobalPrefix("api");

  await app.init();
  return server;
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const startLocal = async () => {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>("PORT") ?? 4000;
    
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.setGlobalPrefix("api");
    
    await app.listen(port);
    console.log(`API is running on http://localhost:${port}/api`);
  };
  startLocal();
}

export const handler = async (req: any, res: any) => {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  return cachedApp(req, res);
};
