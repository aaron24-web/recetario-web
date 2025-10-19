const supabase = require('../config/supabaseClient');

/**
 * Obtiene una lista de todas las etiquetas.
 */
const getAllTags = async () => {
  const { data, error } = await supabase
    .from('tags')
    .select('*');

  if (error) {
    throw error; // <-- CAMBIO
  }
  return data;
};

/**
 * Crea una nueva etiqueta.
 */
const createTag = async (name) => {
  const { data, error } = await supabase
    .from('tags')
    .insert({ name })
    .select()
    .single();

  if (error) {
    throw error; // <-- CAMBIO
  }
  return data;
};

/**
 * Elimina una etiqueta por su ID.
 */
const deleteTag = async (id) => {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id);

  if (error) {
    throw error; // <-- CAMBIO
  }
};

/**
 * Asigna una etiqueta existente a una receta.
 */
const addTagToRecipe = async (recipeId, tagId) => {
  const { data, error } = await supabase
    .from('recipe_tags')
    .insert({
      recipe_id: recipeId,
      tag_id: tagId,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Esta etiqueta ya está asignada a la receta.');
    }
    throw error; // <-- CAMBIO
  }
  return data;
};

/**
 * Elimina la asignación de una etiqueta a una receta.
 */
const removeTagFromRecipe = async (recipeId, tagId) => {
  const { error } = await supabase
    .from('recipe_tags')
    .delete()
    .eq('recipe_id', recipeId)
    .eq('tag_id', tagId);

  if (error) {
    throw error; // <-- CAMBIO
  }
};

module.exports = {
  getAllTags,
  createTag,
  deleteTag,
  addTagToRecipe,
  removeTagFromRecipe,
};