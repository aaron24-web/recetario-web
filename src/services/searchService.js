// src/services/searchService.js
const supabase = require('../config/supabaseClient');

/**
 * Busca recetas usando Full-Text Search en la columna 'fts'.
 */
const searchRecipes = async (query) => {
  // Prepara el término de búsqueda para FTS.
  // Ej: "pollo al limón" se convierte en "pollo & al & limón"
  // Esto busca palabras que aparezcan juntas o cerca.
  const processedQuery = query.trim().split(/\s+/).join(' & '); // Divide por espacios y une con '&'

  const { data, error } = await supabase
    .from('recipes')
    .select(`
      id,
      name,
      description,
      image_url,
      difficulty,
      profiles!user_id ( username ),
      categories ( name ),
      tags ( name )
    `)
    // Usamos la función textSearch de Supabase
    .textSearch('fts', processedQuery, {
      config: 'spanish', // Importante: el mismo idioma que usaste en el ALTER TABLE
      type: 'websearch' // 'websearch' es más flexible que 'plain' o 'phrase'
    });

  if (error) {
    throw error; // Lanza el error completo para que lo maneje el errorHandler
  }
  return data;
};

module.exports = {
  searchRecipes,
};