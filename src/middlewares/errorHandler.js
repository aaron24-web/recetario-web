// src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  // Es bueno registrar el error original en la consola para depuración
  console.error('ERROR DETECTADO:', err);

  // Error de clave duplicada (ej: categoría o ingrediente ya existe)
  if (err.code === '23505') {
    // El mensaje 'err.detail' de Supabase suele ser útil, como:
    // "Key (name)=(Sopas) already exists."
    let message = 'Ese recurso ya existe. Asegúrate de crear uno inexistente.';
    
    // Podemos intentar hacerlo más específico si el error nos da pistas
    if (err.detail && err.detail.includes('categories')) {
      message = 'Esa categoría ya existe, por favor crea una nueva.';
    } else if (err.detail && err.detail.includes('ingredients')) {
      message = 'Ese ingrediente ya existe.';
    } else if (err.detail && err.detail.includes('tags')) {
      message = 'Esa etiqueta ya existe.';
    }

    return res.status(409).json({
      status: 'error',
      code: 'CONFLICT_DUPLICATE',
      message: message,
    });
  }

  // Error de restricción de clave foránea (ej: eliminar una categoría en uso)
  if (err.code === '23503') {
    let message = 'No se puede eliminar este recurso porque está siendo utilizado en otro lugar.';
    
    // Ejemplo de cómo personalizarlo
    if (err.detail && err.detail.includes('recipes')) {
        message = 'No se puede eliminar porque está en uso en una o más recetas.';
    }

    return res.status(409).json({
      status: 'error',
      code: 'CONFLICT_IN_USE',
      message: message,
    });
  }

  // Otros errores comunes de Supabase (ej. valor inválido)
  if (err.code === '22P02') {
    return res.status(400).json({
        status: 'error',
        code: 'INVALID_INPUT',
        message: 'El formato de uno de los campos es incorrecto (ej. un ID inválido).',
    });
  }

  // Error por defecto si no es uno de los anteriores
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Ocurrió un error inesperado en el servidor.',
  });
};

module.exports = errorHandler;