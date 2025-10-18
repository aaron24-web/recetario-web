const supabase = require('../config/supabaseClient');

/**
 * Obtiene una lista de todas las recetas con información básica.
 */
const getAllRecipes = async () => {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      id,
      name,
      description,
      image_url,
      difficulty,
      profiles!user_id ( username ),
      categories ( name )
    `);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

/**
 * Obtiene todos los detalles de una receta específica por su ID.
 */
const getRecipeById = async (id) => {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles!user_id ( username, avatar_url ),
      categories ( name ),
      steps ( step_number, description ),
      recipe_ingredients ( quantity, unit, ingredients ( name ) ),
      comments ( *, profiles (username, avatar_url) ),
      tags ( id, name )
    `)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
  // Devuelve el primer elemento si existe, o null si no hay resultados
  return data && data.length > 0 ? data[0] : null;
};


/**
 * Crea una nueva receta en la base de datos.
 */
const createRecipe = async (recipeData, userId) => {
  const {
    name,
    description,
    image_url,
    prep_time,
    difficulty,
    category_id,
    ingredients, // Esperamos un array: [{ ingredient_id, quantity, unit }]
    steps, // Esperamos un array: [{ step_number, description }]
  } = recipeData;

  // 1. Insertar la receta principal
  const { data: newRecipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      name,
      description,
      image_url,
      prep_time,
      difficulty,
      category_id,
      user_id: userId,
    })
    .select()
    .single();

  if (recipeError) {
    throw new Error(recipeError.message);
  }

  // 2. Preparar y insertar los pasos
  const stepsToInsert = steps.map(step => ({
    ...step,
    recipe_id: newRecipe.id,
  }));
  const { error: stepsError } = await supabase.from('steps').insert(stepsToInsert);

  if (stepsError) {
    // En una app real, aquí borraríamos la receta creada para mantener consistencia
    throw new Error(stepsError.message);
  }

  // 3. Preparar y insertar los ingredientes
  const ingredientsToInsert = ingredients.map(ing => ({
    ...ing,
    recipe_id: newRecipe.id,
  }));
  const { error: ingredientsError } = await supabase.from('recipe_ingredients').insert(ingredientsToInsert);

  if (ingredientsError) {
    throw new Error(ingredientsError.message);
  }

  return newRecipe;
};

/**
 * Actualiza una receta existente.
 * Solo el usuario que creó la receta puede actualizarla.
 */
const updateRecipe = async (id, recipeData, userId) => {
  const { data, error } = await supabase
    .from('recipes')
    .update(recipeData)
    .eq('id', id)
    .eq('user_id', userId) // <-- ¡Clave de seguridad!
    .select()
    .single();

  if (error) {
    // Si el error es porque no encontró la fila, no es un error de servidor.
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data;
};

/**
 * Elimina una receta.
 * Solo el usuario que creó la receta puede eliminarla.
 */
const deleteRecipe = async (id, userId) => {
  const { data, error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // <-- ¡Clave de seguridad!

  if (error) {
    throw new Error(error.message);
  }
  return data; // Devuelve los datos eliminados o null
};

const addFavoriteRecipe = async (userId, recipeId) => {
  const { data, error } = await supabase
    .from('user_favorites')
    .insert({
      user_id: userId,
      recipe_id: recipeId,
    })
    .select();

  if (error) {
    // Si el error es por 'duplicate key', significa que ya era favorita.
    if (error.code === '23505') {
        throw new Error('La receta ya está en tus favoritos.');
    }
    throw new Error(error.message);
  }
  return data;
};

/**
 * Elimina una receta de la lista de favoritos de un usuario.
 */
const removeFavoriteRecipe = async (userId, recipeId) => {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .match({ user_id: userId, recipe_id: recipeId });

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Obtiene todas las recetas favoritas de un usuario.
 */
const getFavoriteRecipes = async (userId) => {
  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      recipes (
        id,
        name,
        description,
        image_url,
        difficulty,
        categories ( name ),
        profiles:user_id ( username )
      )
    `)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }
  // Extraemos solo el objeto de la receta del resultado
  return data.map(fav => fav.recipes);
};


module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe, 
  deleteRecipe,
  addFavoriteRecipe,
  removeFavoriteRecipe,
  getFavoriteRecipes,
};
