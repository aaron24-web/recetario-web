const tagService = require('../services/tagService');

const getAll = async (req, res) => {
  try {
    const tags = await tagService.getAllTags();
    res.status(200).json(tags);
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
    const newTag = await tagService.createTag(name);
    res.status(201).json({ message: 'Etiqueta creada con éxito', tag: newTag });
  } catch (error) {
    // Manejar error de nombre duplicado
    if (error.code === '23505') {
      return res.status(409).json({ error: 'La etiqueta ya existe.' });
    }
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await tagService.deleteTag(id);
    res.status(204).send(); // Éxito, sin contenido
  } catch (error) {
    // Manejar error de etiqueta en uso (foreign key violation)
    if (error.code === '23503') {
      return res.status(409).json({ error: 'Esta etiqueta no se puede eliminar porque está en uso en una o más recetas.' });
    }
    res.status(500).json({ error: error.message });
  }
};

const assignTag = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { tagId } = req.body;

    if (!tagId) {
      return res.status(400).json({ error: 'El tagId es requerido.' });
    }

    const newAssignment = await tagService.addTagToRecipe(recipeId, tagId);
    res.status(201).json({ message: 'Etiqueta asignada con éxito', data: newAssignment });

  } catch (error) {
    if (error.message.includes('ya está asignada')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const unassignTag = async (req, res) => {
  try {
    const { recipeId, tagId } = req.params;
    await tagService.removeTagFromRecipe(recipeId, tagId);
    res.status(204).send(); // Éxito, sin contenido
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  create,
  remove,
  assignTag,
  unassignTag, // <-- Exportar nueva función
};