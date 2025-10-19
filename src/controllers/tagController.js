const tagService = require('../services/tagService');

const getAll = async (req, res, next) => {
  try {
    const tags = await tagService.getAllTags();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'El nombre es requerido.' });
    }
    const newTag = await tagService.createTag(name);
    res.status(201).json({ message: 'Etiqueta creada con éxito', tag: newTag });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await tagService.deleteTag(id);
    res.status(204).send(); // Éxito, sin contenido
  } catch (error) {
    next(error);
  }
};

const assignTag = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { tagId } = req.body;

    if (!tagId) {
      return res.status(400).json({ error: 'El tagId es requerido.' });
    }

    const newAssignment = await tagService.addTagToRecipe(recipeId, tagId);
    res.status(201).json({ message: 'Etiqueta asignada con éxito', data: newAssignment });

  } catch (error) {
    next(error);
  }
};

const unassignTag = async (req, res, next) => {
  try {
    const { recipeId, tagId } = req.params;
    await tagService.removeTagFromRecipe(recipeId, tagId);
    res.status(204).send(); // Éxito, sin contenido
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  create,
  remove,
  assignTag,    // <-- Asegúrate de que esta línea esté
  unassignTag,  // <-- Asegúrate de que esta línea esté
};