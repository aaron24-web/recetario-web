const swaggerJSDoc = require('swagger-jsdoc');

// Definición básica de la API para Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Recetario',
    version: '1.0.0',
    description: 'Documentación para la API de un recetario de cocina. Permite a los usuarios registrarse, iniciar sesión y gestionar recetas.',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor de desarrollo',
    },
  ],
};

// Opciones para swagger-jsdoc
const options = {
  swaggerDefinition,
  // Rutas a los archivos que contienen las anotaciones de la API
  apis: ['./src/routes/*.js'],
};

// Inicializar swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;