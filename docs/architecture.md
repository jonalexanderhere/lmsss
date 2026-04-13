# NetClassix Architecture

## Frontend

The frontend uses Next.js App Router with server components by default and client components only for interactive areas such as auth, charts, AI chat, quiz sessions, and the TJKT lab simulator.

## Backend

NestJS exposes REST endpoints for auth-aware dashboards, course catalog, quizzes, results, AI analysis, and predictive learning. Guards enforce role-based access control with Supabase-issued JWT tokens.

## Data Layer

Supabase provides PostgreSQL, Storage for lesson assets, and Realtime subscriptions for result updates and tutor interactions. Database access is performed through `@supabase/supabase-js`.

## AI Layer

OpenRouter powers score analysis, personalized feedback, learning recommendations, and the TJKT tutor chat. The backend normalizes prompts and validates AI JSON responses before persisting them.
