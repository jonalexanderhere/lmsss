# Setup Guide

## 1. Install dependencies

```bash
npm install
```

## 2. Create Supabase project

1. Create a Supabase project.
2. Copy `.env.example` to `.env`.
3. Fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_JWT_SECRET`.
4. Run `supabase/schema.sql` in the SQL editor.

## 3. Configure Auth

- Enable email/password auth in Supabase.
- Add custom user metadata `role` and `name` during signup.
- Recommended production flow:
  `Auth -> frontend sync-profile -> backend RBAC -> Supabase RLS`

## 4. Configure OpenRouter

- Fill `OPENROUTER_API_KEY`.
- Default model is `mistralai/mistral-7b-instruct:free`.
- AI features gracefully fall back to heuristic outputs if the key is absent.

## 5. Start development

```bash
npm run dev:web
npm run dev:api
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:4000/api`
