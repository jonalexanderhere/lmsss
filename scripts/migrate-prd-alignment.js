const postgres = require("postgres");
require("dotenv").config();

const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

async function migrate() {
  try {
    console.log("🚀 Running PRD Alignment Migration (Face Auth & Attendance)...");

    // Enable pgvector for face embeddings if available
    await sql`CREATE EXTENSION IF NOT EXISTS vector;`.catch(() => console.log("⚠️ pgvector not available, falling back to JSONB"));

    // Face Data Table
    await sql`
      CREATE TABLE IF NOT EXISTS public.face_data (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        embedding jsonb NOT NULL, -- Fallback to JSONB for flexibility
        created_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE(user_id)
      );
    `;

    // Attendance Table
    await sql`
      CREATE TABLE IF NOT EXISTS public.attendance (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        class_name text NOT NULL,
        status text NOT NULL CHECK (status IN ('present', 'late', 'absent', 'excused')),
        confidence_score float NOT NULL DEFAULT 0.0,
        metadata jsonb DEFAULT '{}'::jsonb, -- Store liveness data if needed
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `;

    // Leaderboard Aggregation View (Materialized for performance)
    await sql`
      CREATE OR REPLACE VIEW public.leaderboard AS
      SELECT 
        u.id as user_id,
        u.name,
        u.email,
        u.xp,
        u.class_name,
        u.grade,
        count(r.id) as sessions_completed
      FROM public.users u
      LEFT JOIN public.results r ON u.id = r.user_id
      GROUP BY u.id
      ORDER BY u.xp DESC;
    `;

    // Policies
    await sql`ALTER TABLE public.face_data ENABLE ROW LEVEL SECURITY;`;
    await sql`ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;`;

    await sql`
      DO $$ BEGIN
        CREATE POLICY "face_data_select_self" ON public.face_data FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "face_data_insert_self" ON public.face_data FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "attendance_select_self_or_teacher" ON public.attendance FOR SELECT USING (
          auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('teacher', 'admin'))
        );
        CREATE POLICY "attendance_insert_self" ON public.attendance FOR INSERT WITH CHECK (auth.uid() = user_id);
      EXCEPTION WHEN OTHERS THEN NULL; END $$;
    `;

    console.log("✅ Database migration complete.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
