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
      recipe_ingredients ( quantity, unit, ingredients ( name ) )
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

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe, // <-- Exportar nueva función
  deleteRecipe, // <-- Exportar nueva función
};
