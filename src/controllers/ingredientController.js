const ingredientService = require('../services/ingredientService');

const getAll = async (req, res) => {
  try {
    const ingredients = await ingredientService.getAllIngredients();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'El nombre es requerido.' });
    }
    const newIngredient = await ingredientService.createIngredient(name);
    res.status(201).json({ message: 'Ingrediente creado con éxito', ingredient: newIngredient });
  } catch (error) {
    // Manejar error de nombre duplicado
    if (error.code === '23505') {
      return res.status(409).json({ error: 'El ingrediente ya existe.' });
    }
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await ingredientService.deleteIngredient(id);
    res.status(204).send();
  } catch (error) {
    // Check for the specific foreign key violation error code
    if (error.code === '23503') {
      return res.status(409).json({ error: 'Este ingrediente no se puede eliminar porque está en uso en una o más recetas.' });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  create,
  remove,
};