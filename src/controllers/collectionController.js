const collectionService = require('../services/collectionService');

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const collections = await collectionService.getCollectionsByUser(userId);
    res.status(200).json(collections);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre es requerido.' });
    }

    const newCollection = await collectionService.createCollection(name, description, userId);
    res.status(201).json({ message: 'Colección creada con éxito', collection: newCollection });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await collectionService.deleteCollection(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const collection = await collectionService.getCollectionById(id, userId);

    if (!collection) {
      return res.status(404).json({ error: 'Colección no encontrada o no te pertenece.' });
    }
    res.status(200).json(collection);
  } catch (error) {
    next(error);
  }
};

const addRecipe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { collectionId } = req.params;
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({ error: 'El recipeId es requerido.' });
    }

    const data = await collectionService.addRecipeToCollection(collectionId, recipeId, userId);
    res.status(201).json({ message: 'Receta añadida a la colección', data });
  } catch (error) {
    next(error);
  }
};

const removeRecipe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { collectionId, recipeId } = req.params;

    await collectionService.removeRecipeFromCollection(collectionId, recipeId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Exportamos TODAS las funciones que el router necesita
module.exports = {
  getAll,
  create,
  remove,
  getById,
  addRecipe,
  removeRecipe,
};