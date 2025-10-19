const recipeService = require('../services/recipeService');

const getAll = async (req, res, next) => {
  try {
    const queryParams = req.query; 
    const recipes = await recipeService.getAllRecipes(queryParams);
    res.status(200).json(recipes);
  } catch (error) {
    next(error); // Pasa al manejador de errores
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await recipeService.getRecipeById(id);

    if (!recipe) {
      // Este es un error de "no encontrado", lo manejamos aquí
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    next(error); // Pasa al manejador de errores
  }
};


const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const newRecipe = await recipeService.createRecipe(req.body, userId);
    res.status(201).json({ message: 'Receta creada con éxito', recipe: newRecipe });
  } catch (error) {
    next(error); // Pasa al manejador de errores
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedRecipe = await recipeService.updateRecipe(id, req.body, userId);

    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Receta no encontrada o no tienes permiso para editarla.' });
    }

    res.status(200).json({ message: 'Receta actualizada con éxito', recipe: updatedRecipe });
  } catch (error) {
    next(error); // Pasa al manejador de errores
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await recipeService.deleteRecipe(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error); // Pasa al manejador de errores
  }
};

// --- ESTAS SON LAS FUNCIONES QUE FALTABAN EN EL EXPORT ---

const addFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;
        await recipeService.addFavoriteRecipe(userId, recipeId);
        res.status(201).json({ message: 'Receta añadida a favoritos.' });
    } catch (error) {
        next(error); // Pasa al manejador de errores
    }
};

const removeFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;
        await recipeService.removeFavoriteRecipe(userId, recipeId);
        res.status(204).send();
    } catch (error) {
        next(error); // Pasa al manejador de errores
    }
};

// --- Y AQUÍ ESTÁ EL EXPORT CORREGIDO ---
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  addFavorite,    // <-- Asegúrate de que esta línea esté
  removeFavorite, // <-- Asegúrate de que esta línea esté
};