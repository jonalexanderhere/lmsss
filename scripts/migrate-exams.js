const postgres = require("postgres");
require("dotenv").config();

const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

async function migrate() {
  try {
    console.log("🚀 Runing Migration (Add Exams support)...");
    await sql`ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS is_exam BOOLEAN DEFAULT false;`;
    console.log("✅ Database migration complete.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
