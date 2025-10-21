// src/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Profiles
 *     description: Endpoints para gestionar los perfiles de usuario.
 */

/**
 * @swagger
 * /profile/me:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: El perfil del usuario.
 *       '401':
 *         description: No autorizado.
 */
router.get('/me', authMiddleware, profileController.getMyProfile);

/**
 * @swagger
 * /profile/me:
 *   put:
 *     summary: Actualiza el perfil del usuario autenticado
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "ElChefMaestro"
 *               avatar_url:
 *                 type: string
 *                 example: "http://example.com/avatar.png"
 *               bio:
 *                 type: string
 *                 example: "Amante de la comida italiana."
 *     responses:
 *       '200':
 *         description: Perfil actualizado.
 *       '401':
 *         description: No autorizado.
 */
router.put('/me', authMiddleware, profileController.updateMyProfile);

/**
 * @swagger
 * /profile/{userId}:
 *   get:
 *     summary: Obtiene el perfil público de un usuario por ID
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: El ID del usuario (UUID).
 *     responses:
 *       '200':
 *         description: El perfil público del usuario y sus recetas.
 *       '404':
 *         description: Perfil no encontrado.
 */
router.get('/:userId', profileController.getUserProfile);

module.exports = router;
