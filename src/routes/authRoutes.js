const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints para registro e inicio de sesión de usuarios.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario (mínimo 6 caracteres).
 *               username:
 *                 type: string
 *                 description: Nombre de usuario único.
 *           example:
 *             email: "usuario@ejemplo.com"
 *             password: "password123"
 *             username: "testuser"
 *     responses:
 *       '201':
 *         description: Usuario registrado con éxito.
 *       '400':
 *         description: Faltan campos requeridos.
 *       '500':
 *         description: Error del servidor.
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión para un usuario existente
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: "usuario@ejemplo.com"
 *             password: "password123"
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso, devuelve el token de acceso.
 *       '401':
 *         description: Credenciales inválidas.
 */
router.post('/login', authController.login);

module.exports = router;
