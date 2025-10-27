// src/controllers/recipeController.js

const recipeService = require('../services/recipeService');

// --- Funciones existentes (getAll, getById, create, update, remove, addFavorite, removeFavorite) ---
const getAll = async (req, res, next) => {
  try {
    const queryParams = req.query;
    const recipes = await recipeService.getAllRecipes(queryParams);
    res.status(200).json(recipes);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await recipeService.getRecipeById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const newRecipe = await recipeService.createRecipe(req.body, userId);
    res.status(201).json({ message: 'Receta creada con éxito', recipe: newRecipe });
  } catch (error) {
    next(error);
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
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await recipeService.deleteRecipe(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const addFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;
        await recipeService.addFavoriteRecipe(userId, recipeId);
        res.status(201).json({ message: 'Receta añadida a favoritos.' });
    } catch (error) {
        next(error);
    }
};

const removeFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;
        await recipeService.removeFavoriteRecipe(userId, recipeId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// --- Función para imagen principal ---
const uploadRecipeImage = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se envió ningún archivo con el campo esperado (ej: "recipeImage").' });
    }

    const updatedRecipe = await recipeService.uploadRecipeImage(recipeId, userId, file);
    res.status(200).json({ message: 'Imagen subida y receta actualizada con éxito.', recipe: updatedRecipe });
  } catch (error) {
    next(error);
  }
};

// --- Función NUEVA para imagen de paso ---
const uploadStepImage = async (req, res, next) => {
  try {
    const { recipeId, stepNumber } = req.params;
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se envió ningún archivo con el campo esperado (ej: "stepImage").' });
    }

    const updatedStep = await recipeService.uploadStepImage(recipeId, stepNumber, userId, file);
    res.status(200).json({ message: `Imagen subida para el paso ${stepNumber} con éxito.`, step: updatedStep });
  } catch (error) {
    next(error);
  }
};

// --- Export CORREGIDO ---
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  addFavorite,
  removeFavorite,
  uploadRecipeImage,
  uploadStepImage, // <-- ¡ASEGÚRATE QUE ESTA LÍNEA ESTÉ AQUÍ!
};