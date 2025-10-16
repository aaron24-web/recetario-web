const supabase = require('../config/supabaseClient');

/**
 * Obtiene una lista de todos los ingredientes.
 */
const getAllIngredients = async () => {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

/**
 * Crea un nuevo ingrediente.
 */
const createIngredient = async (name) => {
  const { data, error } = await supabase
    .from('ingredients')
    .insert({ name })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

/**
 * Elimina un ingrediente por su ID.
 */
const deleteIngredient = async (id) => {
  const { error } = await supabase
    .from('ingredients')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllIngredients,
  createIngredient,
  deleteIngredient,
};