const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

/**
 * @swagger
 * tags:
 *   - name: Search
 *     description: Endpoint para búsqueda global de recetas.
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Busca recetas por un término clave en nombre y descripción
 *     tags: 
 *       - Search
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: El término de búsqueda (ej. "pollo", "tacos al pastor"). Mínimo 1 carácter.
 *     responses:
 *       '200':
 *         description: Lista de recetas que coinciden con la búsqueda.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecipeSummary'
 *       '400':
 *         description: No se proporcionó un término de búsqueda válido en el parámetro 'q'.
 *       '500':
 *         description: Error interno del servidor.
 */

router.get('/', searchController.search);

/**
 * @swagger
 * components:
 *   schemas:
 *     RecipeSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         image_url:
 *           type: string
 *         difficulty:
 *           type: string
 *         profiles:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *         categories:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *         tags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 */

module.exports = router;
