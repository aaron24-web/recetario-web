const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Tags
 *     description: Endpoints para gestionar las etiquetas (ej. Vegano, Sin Gluten).
 */

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Obtiene una lista de todas las etiquetas
 *     tags: [Tags]
 *     responses:
 *       '200':
 *         description: Una lista de etiquetas.
 */
router.get('/', tagController.getAll);

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Crea una nueva etiqueta
 *     tags: [Tags]
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
 *                 example: "Vegano"
 *     responses:
 *       '201':
 *         description: Etiqueta creada con éxito.
 *       '401':
 *         description: No autorizado.
 *       '409':
 *         description: La etiqueta ya existe.
 */
router.post('/', authMiddleware, tagController.create);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Elimina una etiqueta
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la etiqueta a eliminar.
 *     responses:
 *       '204':
 *         description: Etiqueta eliminada con éxito.
 *       '401':
 *         description: No autorizado.
 *       '409':
 *         description: La etiqueta está en uso y no se puede eliminar.
 */
router.delete('/:id', authMiddleware, tagController.remove);

module.exports = router;