const { execSync } = require('child_process');
const path = require('path');

function runStep(name, command) {
  console.log(`\n==========================================`);
  console.log(`📝 STEP: ${name}`);
  console.log(`==========================================`);
  try {
    execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log(`✅ ${name} completed successfully.`);
  } catch (err) {
    console.error(`❌ ${name} failed.`);
    process.exit(1);
  }
}

console.log('☢️  NUKE AND REBUILD INITIATED ☢️');
console.log('Target: Local Workspace & Supabase Database');

// 1. Run Database Setup (Schema execution)
runStep('Database Schema Setup', 'node scripts/setup-db.js');

// 2. Create/Update Admin Account
runStep('Admin Provisioning', 'node scripts/create-admin.js');

console.log('\n✨ ALL SYSTEMS RESET AND REBUILT ✨');
console.log('The database is now clean and the Admin account is provisioned.');
console.log('Please check your Vercel/Local site for access.');
