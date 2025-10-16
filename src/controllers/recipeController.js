const recipeService = require('../services/recipeService');

const getAll = async (req, res) => {
  try {
    const recipes = await recipeService.getAllRecipes();
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

module.exports = {
  getAll,
  getById,
  create,
};