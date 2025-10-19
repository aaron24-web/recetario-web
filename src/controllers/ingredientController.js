const ingredientService = require('../services/ingredientService');

const getAll = async (req, res, next) => {
  try {
    const ingredients = await ingredientService.getAllIngredients();
    res.status(200).json(ingredients);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newIngredient = await ingredientService.createIngredient(name);
    res.status(201).json(newIngredient);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ingredientService.deleteIngredient(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  create,
  remove,
};