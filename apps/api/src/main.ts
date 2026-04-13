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

const handler = async (req: any, res: any) => {
  try {
    if (!cachedApp) {
      console.log("🛠️  BOOTSTRAP_START: Initializing NestJS application...");
      cachedApp = await bootstrap();
      console.log("🚀 BOOTSTRAP_SUCCESS: NestJS application initialized.");
    }
    return await cachedApp(req, res);
  } catch (err: any) {
    console.error("❌ SERVERLESS_HANDLER_CRASH: An unhandled exception occurred.");
    console.error("DETAILS:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    // Return a structured error so Vercel doesn't just show a generic 500 if possible
    if (res.status) {
      res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error during bootstrap",
        error: err.message
      });
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal Server Error during bootstrap" })
      };
    }
  }
};

export default handler;
