// src/controllers/searchController.js
const searchService = require('../services/searchService');

const search = async (req, res, next) => {
  try {
    const { q } = req.query; // El parámetro de búsqueda será '?q='

    if (!q || q.trim() === '') {
      // Validamos que 'q' no esté vacío
      return res.status(400).json({ error: 'El parámetro de búsqueda "q" es requerido.' });
    }

    const results = await searchService.searchRecipes(q);
    res.status(200).json(results);
  } catch (error) {
    next(error); // Pasamos cualquier error al manejador central
  }
};

module.exports = {
  search,
};