const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TEACHER_EMAIL = 'ahmad_subhan@netclassix.app';
const TEACHER_PASSWORD = 'TeacherSubhan123!';
const TEACHER_NAME = 'Ahmad Subhan S.Kom';

async function createTeacher() {
  console.log(`🚀 Creating Teacher Account: ${TEACHER_NAME}...`);
  
  try {
    // 1. Create in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: TEACHER_EMAIL,
      password: TEACHER_PASSWORD,
      email_confirm: true,
      user_metadata: { 
        name: TEACHER_NAME,
        role: 'teacher'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('ℹ️ Teacher user already exists in Auth. Updating metadata...');
        // Find user first
        const { data: usersData } = await supabase.auth.admin.listUsers();
        const existing = usersData.users.find(u => u.email === TEACHER_EMAIL);
        if (existing) {
          await supabase.auth.admin.updateUserById(existing.id, {
            password: TEACHER_PASSWORD,
            user_metadata: { role: 'teacher', name: TEACHER_NAME }
          });
          syncToDb(existing.id);
        }
      } else {
        throw authError;
      }
    } else {
      console.log('✅ Auth user created.');
      syncToDb(authData.user.id);
    }
  } catch (err) {
    console.error('❌ Error creating teacher:', err.message);
  }
}

async function syncToDb(userId) {
  console.log(`🛡️ Syncing ${TEACHER_NAME} to public.users...`);
  const { error: dbError } = await supabase
    .from('users')
    .upsert({
      id: userId,
      email: TEACHER_EMAIL,
      name: TEACHER_NAME,
      role: 'teacher',
      status: 'active'
    });
  
  if (dbError) console.error('❌ DB Sync Error:', dbError.message);
  else console.log('✨ Teacher account fully provisioned!');
}

createTeacher();
