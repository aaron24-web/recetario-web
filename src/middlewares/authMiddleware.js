require('dotenv').config(); // <-- AÑADE ESTA LÍNEA
const supabase = require('../config/supabaseClient');

const authMiddleware = async (req, res, next) => {
  // 1. Extraer el token del header 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Access denied.' });
  }

  try {
    // 2. Verificar el token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new Error('Invalid or expired token.');
    }

    // 3. Si el token es válido, adjuntamos el usuario al objeto 'req'
    req.user = user;

    // 4. Pasamos al siguiente middleware o al controlador
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed: ' + error.message });
  }
};

module.exports = authMiddleware;
