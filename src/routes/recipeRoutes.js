const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middlewares/authMiddleware'); // <-- Importar el middleware

/**
 * @swagger
 * tags:
 * - name: Recipes
 *   description: Endpoints para gestionar las recetas.
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Obtiene una lista de todas las recetas
 *     tags: [Recipes]
 *     responses:
 *       '200':
 *         description: Una lista de recetas.
 *       '500':
 *         description: Error del servidor.
 */
router.get('/', recipeController.getAll);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Crea una nueva receta
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image_url:
 *                 type: string
 *               prep_time:
 *                 type: integer
 *               difficulty:
 *                 type: string
 *                 enum: [Fácil, Medio, Difícil]
 *               category_id:
 *                 type: integer
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredient_id:
 *                       type: integer
 *                     quantity:
 *                       type: number
 *                     unit:
 *                       type: string
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     step_number:
 *                       type: integer
 *                     description:
 *                       type: string
 *           example:
 *             name: "Tacos al Pastor"
 *             description: "Deliciosos tacos de cerdo marinado."
 *             image_url: "http://example.com/tacos.jpg"
 *             prep_time: 60
 *             difficulty: "Medio"
 *             category_id: 1
 *             ingredients:
 *               - ingredient_id: 1
 *                 quantity: 500
 *                 unit: "gramos"
 *               - ingredient_id: 2
 *                 quantity: 10
 *                 unit: "unidades"
 *             steps:
 *               - step_number: 1
 *                 description: "Marinar la carne de cerdo."
 *               - step_number: 2
 *                 description: "Cocinar en el trompo."
 *     responses:
 *       '201':
 *         description: Receta creada con éxito.
 *       '401':
 *         description: No autorizado (token inválido o no proporcionado).
 *       '500':
 *         description: Error del servidor.
 */
router.post('/', authMiddleware, recipeController.create); // <-- Ruta protegida

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Actualiza una receta existente
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la receta a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               difficulty:
 *                 type: string
 *           example:
 *             name: "Flan Casero Cremoso"
 *             difficulty: "Difícil"
 *     responses:
 *       '200':
 *         description: Receta actualizada con éxito.
 *       '401':
 *         description: No autorizado.
 *       '404':
 *         description: Receta no encontrada o sin permisos.
 */
router.put('/:id', authMiddleware, recipeController.update);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Obtiene los detalles de una receta específica
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la receta.
 *     responses:
 *       '200':
 *         description: Detalles de la receta.
 *       '404':
 *         description: Receta no encontrada.
 *       '500':
 *         description: Error del servidor.
 */
router.get('/:id', recipeController.getById);

// We also need to tell Swagger how to handle the security scheme
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Elimina una receta
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la receta a eliminar.
 *     responses:
 *       '204':
 *         description: Receta eliminada con éxito.
 *       '401':
 *         description: No autorizado.
 */
router.delete('/:id', authMiddleware, recipeController.remove);

module.exports = router;