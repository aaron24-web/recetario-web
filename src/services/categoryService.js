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

module.exports = {
  getAllCategories,
};