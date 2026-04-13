const postgres = require('postgres');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env
dotenv.config();

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('❌ Error: POSTGRES_URL not found in .env');
  process.exit(1);
}

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1
});

async function runSchema() {
  try {
    console.log('🚀 Connecting to Supabase Database...');
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📜 Executing schema.sql...');
    
    // We split by ';' but carefully, though postgres-js can handle large strings
    // but schema.sql might have triggers/functions that need careful execution.
    // However, postgres-js can usually handle multiple statements if they are valid.
    await sql.unsafe(schemaSql);

    console.log('✅ Schema executed successfully!');
  } catch (err) {
    console.error('❌ Error executing schema:', err);
  } finally {
    await sql.end();
  }
}

runSchema();
