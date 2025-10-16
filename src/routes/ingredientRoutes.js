const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Ingredients
 *     description: Endpoints para gestionar los ingredientes.
 */

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Obtiene una lista de todos los ingredientes
 *     tags: [Ingredients]
 *     responses:
 *       '200':
 *         description: Una lista de ingredientes.
 */
router.get('/', ingredientController.getAll);

/**
 * @swagger
 * /ingredients:
 *   post:
 *     summary: Crea un nuevo ingrediente
 *     tags: [Ingredients]
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
 *             name: "Tomate"
 *     responses:
 *       '201':
 *         description: Ingrediente creado con éxito.
 *       '401':
 *         description: No autorizado.
 *       '409':
 *         description: El ingrediente ya existe.
 */
router.post('/', authMiddleware, ingredientController.create);

/**
 * @swagger
 * /ingredients/{id}:
 *   delete:
 *     summary: Elimina un ingrediente
 *     tags: [Ingredients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del ingrediente a eliminar.
 *     responses:
 *       '204':
 *         description: Ingrediente eliminado con éxito.
 *       '401':
 *         description: No autorizado.
 */
router.delete('/:id', authMiddleware, ingredientController.remove);

module.exports = router;