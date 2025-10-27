// src/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

// Configuración de Multer (la misma para ambas subidas)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

/**
 * @swagger
 * tags:
 *   - name: Recipes
 *     description: Endpoints para gestionar las recetas.
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Obtiene una lista de recetas, con filtros y paginación
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: (Opcional) El ID de la categoría para filtrar.
 *       - in: query
 *         name: categoryName
 *         schema:
 *           type: string
 *         description: (Opcional) El nombre de la categoría (ej. "Postres").
 *       - in: query
 *         name: tagName
 *         schema:
 *           type: string
 *         description: (Opcional) El nombre de la etiqueta (ej. "Vegano").
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: (Opcional) El número de página a solicitar.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: (Opcional) El número de recetas por página.
 *     responses:
 *       '200':
 *         description: Una lista paginada y/o filtrada de recetas.
 *       '500':
 *         description: Error del servidor.
 */
router.get('/', recipeController.getAll);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Crea una nueva receta
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             title: "Tarta de manzana"
 *             description: "Una deliciosa receta casera."
 *             categoryId: 2
 *             steps: ["Pelar manzanas", "Hornear 45 minutos"]
 *     responses:
 *       '201':
 *         description: Receta creada con éxito.
 *       '401':
 *         description: No autorizado.
 *       '500':
 *         description: Error del servidor.
 */
router.post('/', authMiddleware, recipeController.create);

/**
 * @swagger
 * /recipes/{recipeId}/tags:
 *   post:
 *     summary: Asigna una etiqueta existente a una receta
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la receta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagId:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Etiqueta asignada correctamente.
 *       '404':
 *         description: Receta o etiqueta no encontrada.
 *       '401':
 *         description: No autorizado.
 */
router.post('/:recipeId/tags', authMiddleware, tagController.assignTag);

/**
 * @swagger
 * /recipes/{recipeId}/tags/{tagId}:
 *   delete:
 *     summary: Elimina la asignación de una etiqueta a una receta
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la receta.
 *       - in: path
 *         name: tagId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la etiqueta.
 *     responses:
 *       '200':
 *         description: Etiqueta eliminada correctamente.
 *       '404':
 *         description: Receta o etiqueta no encontrada.
 */
router.delete('/:recipeId/tags/:tagId', authMiddleware, tagController.unassignTag);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Actualiza una receta existente
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la receta a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Receta actualizada con éxito.
 *       '404':
 *         description: Receta no encontrada.
 */
router.put('/:id', authMiddleware, recipeController.update);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Obtiene los detalles de una receta específica
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la receta.
 *     responses:
 *       '200':
 *         description: Detalles de la receta.
 *       '404':
 *         description: Receta no encontrada.
 */
router.get('/:id', recipeController.getById);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Elimina una receta
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la receta.
 *     responses:
 *       '200':
 *         description: Receta eliminada correctamente.
 *       '404':
 *         description: Receta no encontrada.
 */
router.delete('/:id', authMiddleware, recipeController.remove);

/**
 * @swagger
 * /recipes/{id}/favorite:
 *   post:
 *     summary: Añade una receta a los favoritos del usuario
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la receta.
 *     responses:
 *       '200':
 *         description: Receta añadida a favoritos.
 *       '401':
 *         description: No autorizado.
 */
router.post('/:id/favorite', authMiddleware, recipeController.addFavorite);

/**
 * @swagger
 * /recipes/{id}/favorite:
 *   delete:
 *     summary: Elimina una receta de los favoritos del usuario
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la receta.
 *     responses:
 *       '200':
 *         description: Receta eliminada de favoritos.
 *       '401':
 *         description: No autorizado.
 */
router.delete('/:id/favorite', authMiddleware, recipeController.removeFavorite);

/**
 * @swagger
 * /recipes/{id}/image:
 *   post:
 *     summary: Sube o reemplaza la imagen principal de una receta
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la receta.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               recipeImage:
 *                 type: string
 *                 format: binary
 *                 description: El archivo de imagen (jpg, png, etc.).
 *     responses:
 *       '200':
 *         description: Imagen subida y receta actualizada.
 *       '400':
 *         description: No se envió archivo o archivo muy grande.
 *       '401':
 *         description: No autorizado.
 *       '403':
 *         description: Sin permisos para esta receta.
 *       '404':
 *         description: Receta no encontrada.
 *       '500':
 *         description: Error interno.
 */
router.post(
  '/:id/image',
  authMiddleware,
  upload.single('recipeImage'),
  recipeController.uploadRecipeImage
);

/**
 * @swagger
 * /recipes/{recipeId}/steps/{stepNumber}/image:
 *   post:
 *     summary: Sube o reemplaza la imagen para un paso específico de una receta
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la receta.
 *       - in: path
 *         name: stepNumber
 *         schema:
 *           type: integer
 *         required: true
 *         description: El número del paso.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               stepImage:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del paso (jpg, png, etc.).
 *     responses:
 *       '200':
 *         description: Imagen subida y paso actualizado con éxito.
 *       '400':
 *         description: No se envió archivo, archivo muy grande o paso inválido.
 *       '401':
 *         description: No autorizado.
 *       '403':
 *         description: Sin permisos para esta receta.
 *       '404':
 *         description: Receta o paso no encontrado.
 *       '500':
 *         description: Error interno al subir o guardar.
 */
router.post(
  '/:recipeId/steps/:stepNumber/image',
  authMiddleware,
  upload.single('stepImage'),
  recipeController.uploadStepImage
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = router;
