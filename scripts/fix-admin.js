const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = 'admin@netclassix.app';
const ADMIN_PASSWORD = 'AdminNetClassix123!';

async function fix() {
  console.log('🔧 Fixing Admin Account...');
  
  // 1. Get User
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === ADMIN_EMAIL);
  
  if (!user) {
    console.log('❌ Admin user not found. Creating from scratch...');
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { name: 'Super Admin', role: 'admin' }
    });
    if (error) console.error('Error creating:', error);
    else console.log('✅ Created.');
  } else {
    console.log(`Found user ${user.id}. Updating password and metadata...`);
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: ADMIN_PASSWORD,
      user_metadata: { 
        name: 'Super Admin', 
        role: 'admin' 
      }
    });
    if (error) console.error('Error updating:', error);
    else console.log('✅ Updated password and role.');
  }

  // 2. Sync to public.users
  console.log('🔄 Syncing to public.users table...');
  const { error: dbError } = await supabase
    .from('users')
    .upsert({
      id: user ? user.id : undefined, // This might be tricky if user was just created
      email: ADMIN_EMAIL,
      name: 'Super Admin',
      role: 'admin',
      status: 'active'
    });
  
  if (dbError) console.error('DB Sync Error:', dbError);
  else console.log('✅ DB Sync Success.');
}

fix();
