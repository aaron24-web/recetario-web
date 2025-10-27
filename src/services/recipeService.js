const supabase = require('../config/supabaseClient');

/**
 * Obtiene una lista de todas las recetas con información básica.
 * Acepta filtros y paginación.
 */
const getAllRecipes = async (queryParams) => {
  // ... (código de paginación)
  const limit = parseInt(queryParams.limit, 10) || 10;
  const page = parseInt(queryParams.page, 10) || 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('recipes');

  // ... (código de selectString y filtros)
  let selectString = `
    id,
    name,
    description,
    image_url,
    difficulty,
    profiles!user_id ( username ),
    categories ( name ),
    tags ( name )
  `;

  if (queryParams.categoryName) {
    selectString = selectString.replace('categories ( name )', 'categories!inner ( name )');
  }
  if (queryParams.tagName) {
    selectString = selectString.replace('tags ( name )', 'tags!inner ( name )');
  }

  query = query.select(selectString);

  if (queryParams.categoryName) {
    query = query.eq('categories.name', queryParams.categoryName);
  }
  if (queryParams.tagName) {
    query = query.eq('tags.name', queryParams.tagName);
  }
  if (queryParams.categoryId) {
    query = query.eq('category_id', queryParams.categoryId);
  }

  query = query.range(from, to);

  const { data, error } = await query;

  if (error) {
    throw error; // <-- CAMBIO
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
    throw error; // <-- CAMBIO
  }
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
    ingredients,
    steps,
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
    throw recipeError; // <-- CAMBIO
  }

  // 2. Preparar y insertar los pasos
  const stepsToInsert = steps.map(step => ({
    ...step,
    recipe_id: newRecipe.id,
  }));
  const { error: stepsError } = await supabase.from('steps').insert(stepsToInsert);

  if (stepsError) {
    throw stepsError; // <-- CAMBIO
  }

  // 3. Preparar y insertar los ingredientes
  const ingredientsToInsert = ingredients.map(ing => ({
    ...ing,
    recipe_id: newRecipe.id,
  }));
  const { error: ingredientsError } = await supabase.from('recipe_ingredients').insert(ingredientsToInsert);

  if (ingredientsError) {
    throw ingredientsError; // <-- CAMBIO
  }

  return newRecipe;
};

/**
 * Actualiza una receta existente.
 */
const updateRecipe = async (id, recipeData, userId) => {
  const { data, error } = await supabase
    .from('recipes')
    .update(recipeData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error; // <-- CAMBIO
  }
  return data;
};

/**
 * Elimina una receta.
 */
const deleteRecipe = async (id, userId) => {
  const { data, error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw error; // <-- CAMBIO
  }
  return data;
};

/**
 * Añade una receta a la lista de favoritos de un usuario.
 */
const addFavoriteRecipe = async (userId, recipeId) => {
  const { data, error } = await supabase
    .from('user_favorites')
    .insert({
      user_id: userId,
      recipe_id: recipeId,
    })
    .select();

  if (error) {
    if (error.code === '23505') {
        throw new Error('La receta ya está en tus favoritos.');
    }
    throw error; // <-- CAMBIO
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
    throw error; // <-- CAMBIO
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
    throw error; // <-- CAMBIO
  }
  return data.map(fav => fav.recipes);
};


const uploadRecipeImage = async (recipeId, userId, file) => {
  // 1. Verificar si la receta pertenece al usuario (¡importante por seguridad!)
  const { data: recipeData, error: ownerError } = await supabase
    .from('recipes')
    .select('id')
    .eq('id', recipeId)
    .eq('user_id', userId) // Comprueba que el user_id coincida
    .single();

  if (ownerError || !recipeData) {
     // Puedes usar un error más específico si quieres que el errorHandler dé un 403 Forbidden o 404 Not Found
     throw new Error('Receta no encontrada o no tienes permiso para modificarla.');
  }

  // 2. Crear un nombre de archivo único para evitar colisiones
  const fileExt = file.originalname.split('.').pop(); // Obtener extensión (jpg, png, etc.)
  const uniqueFileName = `recipe_${recipeId}_${Date.now()}.${fileExt}`;
  // Guardaremos las imágenes dentro de una carpeta 'public' en el bucket
  // Podrías organizarlo por usuario si prefieres: `${userId}/${uniqueFileName}`
  const filePath = `public/${uniqueFileName}`; 

  // 3. Subir el archivo a Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('recipe-images') // <-- El nombre de tu bucket
    .upload(filePath, file.buffer, { // file.buffer viene de multer (memoryStorage)
      contentType: file.mimetype, // Ej: 'image/jpeg', 'image/png'
      upsert: false, // Para no sobrescribir si ya existe (puedes poner true si prefieres)
    });

  if (uploadError) {
    console.error('Error subiendo a Supabase Storage:', uploadError);
    throw new Error('Error al subir la imagen al almacenamiento.');
  }

  // 4. Obtener la URL pública de la imagen recién subida
  const { data: urlData } = supabase.storage
    .from('recipe-images') // <-- Tu bucket
    .getPublicUrl(filePath);
    
  if (!urlData || !urlData.publicUrl) {
       // Si esto falla, podrías intentar borrar el archivo subido para limpiar
       console.error('Error obteniendo URL pública para:', filePath);
       throw new Error('Imagen subida, pero no se pudo obtener la URL pública.');
  }
  const imageUrl = urlData.publicUrl;


  // 5. Actualizar la columna 'image_url' de la receta en la base de datos
  const { data: updatedRecipe, error: updateError } = await supabase
    .from('recipes')
    .update({ image_url: imageUrl }) // Guarda la URL completa
    .eq('id', recipeId)
    .select() // Devuelve la receta actualizada
    .single();

  if (updateError) {
    console.error('Error actualizando receta en DB:', updateError);
    throw new Error('Imagen subida, pero hubo un error al guardar la URL en la receta.');
  }

  return updatedRecipe; // Devuelve la receta con la nueva URL de imagen
};

// --- AL FINAL DEL ARCHIVO ---
module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe, 
  deleteRecipe,
  addFavoriteRecipe,
  removeFavoriteRecipe,
  getFavoriteRecipes,
  uploadRecipeImage, // <-- ¡Añade la nueva función aquí!
};