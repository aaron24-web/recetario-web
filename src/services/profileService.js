// src/services/profileService.js
const supabase = require('../config/supabaseClient');

/**
 * Obtiene un perfil público de usuario, incluyendo sus recetas.
 */
const getProfileById = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      username,
      avatar_url,
      bio,
      recipes!user_id ( id, name, image_url, description, difficulty )
    `)
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No encontrado
    throw error;
  }
  return data;
};

/**
 * Actualiza el perfil del usuario autenticado.
 */
const updateProfile = async (userId, profileData) => {
  const { username, avatar_url, bio } = profileData;

  const { data, error } = await supabase
    .from('profiles')
    .update({
      username,
      avatar_url,
      bio,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

module.exports = {
  getProfileById,
  updateProfile,
};