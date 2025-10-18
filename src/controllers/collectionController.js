const collectionService = require('../services/collectionService');

const getAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const collections = await collectionService.getCollectionsByUser(userId);
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre es requerido.' });
    }

    const newCollection = await collectionService.createCollection(name, description, userId);
    res.status(201).json({ message: 'Colección creada con éxito', collection: newCollection });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await collectionService.deleteCollection(id, userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  create,
  remove,
};

const getById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const collection = await collectionService.getCollectionById(id, userId);

    if (!collection) {
      return res.status(404).json({ error: 'Colección no encontrada o no te pertenece.' });
    }
    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addRecipe = async (req, res) => {
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
    if (error.message.includes('No tienes permiso')) {
      return res.status(403).json({ error: error.message });
    }
    if (error.message.includes('ya está en esta colección')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const removeRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { collectionId, recipeId } = req.params;

    await collectionService.removeRecipeFromCollection(collectionId, recipeId, userId);
    res.status(204).send();
  } catch (error) {
    if (error.message.includes('No tienes permiso')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  create,
  remove,
  getById, // <-- Exportar nueva función
  addRecipe, // <-- Exportar nueva función
  removeRecipe, // <-- Exportar nueva función
};