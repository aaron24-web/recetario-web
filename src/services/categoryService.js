const supabase = require('../config/supabaseClient');

/**
 * Obtiene una lista de todas las categorías.
 */
const getAllCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

/**
 * Crea una nueva categoría.
 */
const createCategory = async (name) => {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

/**
 * Elimina una categoría por su ID.
 */
const deleteCategory = async (id) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllCategories,
  createCategory, // <-- Exportar nueva función
  deleteCategory, // <-- Exportar nueva función
};