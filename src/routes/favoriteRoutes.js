const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Favorites
 *     description: Endpoints para gestionar las recetas favoritas del usuario.
 */

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Obtiene la lista de recetas favoritas del usuario actual
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Una lista de las recetas favoritas del usuario.
 *       '401':
 *         description: No autorizado.
 */
router.get('/', authMiddleware, favoriteController.getMyFavorites);

module.exports = router;
