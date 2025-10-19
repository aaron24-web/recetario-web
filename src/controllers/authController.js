const authService = require('../services/authService');

// --- Función 'register' actualizada para usar el middleware de errores ---
const register = async (req, res, next) => {
  const { email, password, username } = req.body;

  // Validación simple
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    const newUser = await authService.registerUser(email, password, username);
    res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
  } catch (error) {
    // Pasamos el error al middleware (ej. si el usuario ya existe)
    next(error);
  }
};

// --- Función 'login' actualizada para dar la respuesta limpia ---
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  try {
    // 1. Obtenemos la sesión completa del servicio
    const { session } = await authService.loginUser(email, password);
    
    // 2. Construimos la respuesta limpia que tú quieres
    const response = {
      message: 'Inicio de sesión exitoso',
      token: session.access_token, // <-- Extraemos solo el token
    };

    // 3. Enviamos solo nuestro objeto 'response'
    res.status(200).json(response);

  } catch (error) {
    // El error de login (401) es esperado, no es un error del servidor.
    // Lo manejamos aquí directamente.
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
};

module.exports = {
  register,
  login,
};