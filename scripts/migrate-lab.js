const postgres = require("postgres");
require("dotenv").config();

const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

async function migrate() {
  try {
    console.log("🚀 Runing Migration...");
    await sql`ALTER TABLE public.practice_lab_runs ADD COLUMN IF NOT EXISTS current_mission_status TEXT DEFAULT 'Pilih misi di terminal untuk memulai.';`;
    console.log("✅ Database migration complete.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
