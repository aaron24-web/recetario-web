const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Endpoints para gestionar las categorías de recetas.
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtiene una lista de todas las categorías
 *     tags: [Categories]
 *     responses:
 *       '200':
 *         description: Una lista de categorías.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       '500':
 *         description: Error del servidor.
 */
router.get('/', categoryController.getAll);

module.exports = router;