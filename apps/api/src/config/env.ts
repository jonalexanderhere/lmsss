import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),
  SUPABASE_JWT_SECRET: z.string().optional().or(z.literal("")),
  JWT_AUDIENCE: z.string().default("authenticated"),
  JWT_ISSUER: z.string().default("netclassix"),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().default("mistralai/mistral-7b-instruct:free"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000")
});

export type AppEnv = z.infer<typeof envSchema>;
