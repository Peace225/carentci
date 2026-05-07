const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function createAdmin() {
  const email = 'contact@carent.ci';
  const password = 'Carent2026!';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const { data, error } = await supabase
    .from('users')
    .insert([{
      email: email,
      password: hashedPassword,
      role: 'admin'
    }])
    .select();
    
  if (error) {
    console.error('Erreur:', error);
  } else {
    console.log('Admin créé avec succès:', data);
  }
}

createAdmin();