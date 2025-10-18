const supabase = require('../config/supabaseClient');

/**
 * Obtiene todas las colecciones creadas por un usuario específico.
 */
const getCollectionsByUser = async (userId) => {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

/**
 * Crea una nueva colección para un usuario.
 */
const createCollection = async (name, description, userId) => {
  const { data, error } = await supabase
    .from('collections')
    .insert({
      name,
      description,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

/**
 * Elimina una colección (siempre que le pertenezca al usuario).
 */
const deleteCollection = async (collectionId, userId) => {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', collectionId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getCollectionsByUser,
  createCollection,
  deleteCollection,
};

/**
 * Obtiene una colección específica por ID, incluyendo sus recetas.
 * Solo devuelve la colección si le pertenece al usuario.
 */
const getCollectionById = async (collectionId, userId) => {
  const { data, error } = await supabase
    .from('collections')
    .select(`
      id,
      name,
      description,
      recipes ( id, name, image_url )
    `)
    .eq('id', collectionId)
    .eq('user_id', userId)
    .single();

  if (error) {
    // Si el error es porque .single() no encontró nada
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data;
};

/**
 * Añade una receta a una colección.
 * Verifica que la colección pertenezca al usuario antes de añadir.
 */
const addRecipeToCollection = async (collectionId, recipeId, userId) => {
  // 1. Verificar que el usuario es dueño de la colección
  const { count, error: ownerError } = await supabase
    .from('collections')
    .select('id', { count: 'exact' })
    .eq('id', collectionId)
    .eq('user_id', userId);

  if (ownerError) throw new Error(ownerError.message);
  if (count === 0) throw new Error('No tienes permiso o la colección no existe.');

  // 2. Si es dueño, insertar la receta
  const { data, error } = await supabase
    .from('collection_recipes')
    .insert({
      collection_id: collectionId,
      recipe_id: recipeId
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new Error('La receta ya está en esta colección.');
    throw new Error(error.message);
  }
  return data;
};

/**
 * Quita una receta de una colección.
 * Verifica que la colección pertenezca al usuario antes de quitar.
 */
const removeRecipeFromCollection = async (collectionId, recipeId, userId) => {
  // 1. Verificar que el usuario es dueño de la colección
  const { count, error: ownerError } = await supabase
    .from('collections')
    .select('id', { count: 'exact' })
    .eq('id', collectionId)
    .eq('user_id', userId);

  if (ownerError) throw new Error(ownerError.message);
  if (count === 0) throw new Error('No tienes permiso o la colección no existe.');

  // 2. Si es dueño, eliminar la receta
  const { error } = await supabase
    .from('collection_recipes')
    .delete()
    .eq('collection_id', collectionId)
    .eq('recipe_id', recipeId);

  if (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getCollectionsByUser,
  createCollection,
  deleteCollection,
  getCollectionById, // <-- Exportar nueva función
  addRecipeToCollection, // <-- Exportar nueva función
  removeRecipeFromCollection, // <-- Exportar nueva función
};