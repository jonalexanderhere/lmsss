const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load .env
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// DEFAULT ADMIN CREDENTIALS (Siswa harus mengganti ini nanti)
const ADMIN_EMAIL = 'admin@netclassix.app';
const ADMIN_PASSWORD = 'AdminNetClassix123!';

async function createAdmin() {
  try {
    console.log(`🚀 Creating Admin Account: ${ADMIN_EMAIL}...`);

    // 1. Create User in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { 
        name: 'Super Admin',
        role: 'admin'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('ℹ️ Admin user already exists in Auth. Proceeding to update role...');
      } else {
        throw authError;
      }
    }

    const userId = authData?.user?.id;

    // 2. Fetch User ID if it already existed
    let finalId = userId;
    if (!finalId) {
      const { data: userData } = await supabase.auth.admin.listUsers();
      const existingUser = userData.users.find(u => u.email === ADMIN_EMAIL);
      if (existingUser) finalId = existingUser.id;
    }

    if (!finalId) throw new Error('Could not determine Admin User ID');
    
    // 2.5 Update Auth metadata if it already existed to ensure role is present
    await supabase.auth.admin.updateUserById(finalId, {
      user_metadata: { role: 'admin' }
    });

    // 3. Upsert into public.users with 'admin' role
    console.log(`🛡️ Assigning 'admin' role to user ${finalId}...`);
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: finalId,
        name: 'Super Admin',
        email: ADMIN_EMAIL,
        role: 'admin',
        xp: 9999,
        rank: 'Administrator',
        status: 'active'
      }, { onConflict: 'id' });

    if (profileError) throw profileError;

    console.log('✅ Admin account created/updated successfully!');
    console.log('------------------------------------------');
    console.log(`EMAIL: ${ADMIN_EMAIL}`);
    console.log(`PASS:  ${ADMIN_PASSWORD}`);
    console.log('------------------------------------------');
    console.log('⚠️ SILAKAN GANTI PASSWORD SETELAH LOGIN PERTAMA!');

  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  }
}

createAdmin();
