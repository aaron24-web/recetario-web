const supabase = require('../config/supabaseClient');

/**
 * Registra un nuevo usuario en Supabase Auth y crea su perfil público.
 */
const registerUser = async (email, password, username) => {
  // 1. Registrar el usuario en Supabase Authentication
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new Error(authError.message);
  }
  
  if (!authData.user) {
    throw new Error('No se pudo crear el usuario en el sistema de autenticación.');
  }

  // 2. Crear el perfil público del usuario en nuestra tabla 'profiles'
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id, // Vincula el perfil al usuario de auth
      username: username
    })
    .select()
    .single();

  if (profileError) {
    // Si falla la creación del perfil, es buena idea borrar el usuario de auth para mantener la consistencia
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(profileError.message);
  }

  return profileData;
};


/**
 * Inicia sesión de un usuario usando Supabase Auth.
 */
const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

module.exports = {
  registerUser,
  loginUser,
};