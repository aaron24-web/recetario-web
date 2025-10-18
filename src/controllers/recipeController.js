const recipeService = require('../services/recipeService');

const getAll = async (req, res) => {
  try {
    // req.query contiene los parámetros de la URL (ej. /recipes?categoryId=1)
    const queryParams = req.query; 

    const recipes = await recipeService.getAllRecipes(queryParams);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await recipeService.getRecipeById(id);

    if (!recipe) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    // Detecta error de cero resultados y responde con 404
    if (error.code === 'PGRST116' || error.message.includes('0 rows')) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
};


const create = async (req, res) => {
  try {
    // El ID del usuario lo obtenemos del middleware, no del body, por seguridad.
    const userId = req.user.id;
    const newRecipe = await recipeService.createRecipe(req.body, userId);
    res.status(201).json({ message: 'Receta creada con éxito', recipe: newRecipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedRecipe = await recipeService.updateRecipe(id, req.body, userId);

    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Receta no encontrada o no tienes permiso para editarla.' });
    }

    res.status(200).json({ message: 'Receta actualizada con éxito', recipe: updatedRecipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await recipeService.deleteRecipe(id, userId);

    // No es necesario verificar el resultado, si no lo encuentra no hace nada.
    // El código 204 significa "éxito, pero no hay contenido que devolver".
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;
        await recipeService.addFavoriteRecipe(userId, recipeId);
        res.status(201).json({ message: 'Receta añadida a favoritos.' });
    } catch (error) {
        if (error.message.includes('ya está en tus favoritos')) {
            return res.status(409).json({ error: error.message }); // 409 Conflict
        }
        res.status(500).json({ error: error.message });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;
        await recipeService.removeFavoriteRecipe(userId, recipeId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  addFavorite,
  removeFavorite,
};