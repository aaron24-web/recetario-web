const categoryService = require('../services/categoryService');

const getAll = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
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
    const newCategory = await categoryService.createCategory(name);
    res.status(201).json({ message: 'Categoría creada con éxito', category: newCategory });
  } catch (error) {
    // Manejar error de nombre duplicado
    if (error.code === '23505') {
      return res.status(409).json({ error: 'La categoría ya existe.' });
    }
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    res.status(204).send(); // Éxito, sin contenido
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  create, // <-- Exportar nueva función
  remove, // <-- Exportar nueva función
};