const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

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
 */
router.get('/', categoryController.getAll);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *           example:
 *             name: "Sopas"
 *     responses:
 *       '201':
 *         description: Categoría creada con éxito.
 *       '401':
 *         description: No autorizado.
 *       '409':
 *         description: La categoría ya existe.
 */
router.post('/', authMiddleware, categoryController.create);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Elimina una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la categoría a eliminar.
 *     responses:
 *       '204':
 *         description: Categoría eliminada con éxito.
 *       '401':
 *         description: No autorizado.
 */
router.delete('/:id', authMiddleware, categoryController.remove);

module.exports = router;