const { createClient } = require('@supabase/supabase-js');
// La siguiente línea no es necesaria aquí si ya la tienes en index.js, 
// pero no hace daño tenerla por seguridad.
require('dotenv').config(); 

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key not found in .env file");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;