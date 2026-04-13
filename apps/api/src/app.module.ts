import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { envSchema } from "./config/env";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CoursesModule } from "./courses/courses.module";
import { QuizzesModule } from "./quizzes/quizzes.module";
import { ResultsModule } from "./results/results.module";
import { AIModule } from "./ai/ai.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { HealthController } from "./health/health.controller";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config)
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60
      }
    ]),
    AuthModule,
    UsersModule,
    CoursesModule,
    QuizzesModule,
    ResultsModule,
    AIModule,
    DashboardModule
  ],
  controllers: [AppController, HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
