const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Collections
 *     description: Endpoints para gestionar las colecciones de recetas de un usuario.
 */

/**
 * @swagger
 * /collections:
 *   get:
 *     summary: Obtiene todas las colecciones del usuario autenticado
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Una lista de las colecciones del usuario.
 *       '401':
 *         description: No autorizado.
 */
router.get('/', authMiddleware, collectionController.getAll);

/**
 * @swagger
 * /collections:
 *   post:
 *     summary: Crea una nueva colección
 *     tags: [Collections]
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
 *               description:
 *                 type: string
 *             example:
 *               name: "Cenas Rápidas"
 *               description: "Recetas para hacer en menos de 20 minutos."
 *     responses:
 *       '201':
 *         description: Colección creada con éxito.
 *       '401':
 *         description: No autorizado.
 */
router.post('/', authMiddleware, collectionController.create);

/**
 * @swagger
 * /collections/{collectionId}/recipes:
 *   post:
 *     summary: Añade una receta a una colección
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la colección.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipeId
 *             properties:
 *               recipeId:
 *                 type: integer
 *           example:
 *             recipeId: 1
 *     responses:
 *       '201':
 *         description: Receta añadida a la colección.
 *       '401':
 *         description: No autorizado.
 *       '403':
 *         description: La colección no pertenece al usuario.
 *       '409':
 *         description: La receta ya está en la colección.
 */
router.post('/:collectionId/recipes', authMiddleware, collectionController.addRecipe);

/**
 * @swagger
 * /collections/{collectionId}/recipes/{recipeId}:
 *   delete:
 *     summary: Quita una receta de una colección
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la colección.
 *       - in: path
 *         name: recipeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la receta a quitar.
 *     responses:
 *       '204':
 *         description: Receta quitada de la colección.
 *       '401':
 *         description: No autorizado.
 *       '403':
 *         description: La colección no pertenece al usuario.
 */
router.delete('/:collectionId/recipes/:recipeId', authMiddleware, collectionController.removeRecipe);

/**
 * @swagger
 * /collections/{id}:
 *   get:
 *     summary: Obtiene una colección específica por ID (con sus recetas)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la colección a ver.
 *     responses:
 *       '200':
 *         description: Detalles de la colección.
 *       '401':
 *         description: No autorizado.
 *       '404':
 *         description: Colección no encontrada o no te pertenece.
 */
router.get('/:id', authMiddleware, collectionController.getById);

/**
 * @swagger
 * /collections/{id}:
 *   delete:
 *     summary: Elimina una colección del usuario
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la colección a eliminar.
 *     responses:
 *       '204':
 *         description: Colección eliminada con éxito.
 *       '401':
 *         description: No autorizado.
 */
router.delete('/:id', authMiddleware, collectionController.remove);

module.exports = router;