const authService = require('../services/authService');

const register = async (req, res) => {
  const { email, password, username } = req.body;

  // Validación simple
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    const newUser = await authService.registerUser(email, password, username);
    res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  try {
    const { user, session } = await authService.loginUser(email, password);
    
    // Construimos una respuesta limpia
    const response = {
      message: 'Inicio de sesión exitoso',
      token: session.access_token,
      user: {
        id: user.id,
        email: user.email,
      }
    };

    res.status(200).json(response); // <-- Ahora enviamos nuestro objeto limpio

  } catch (error) {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
};

module.exports = {
  register,
  login,
};