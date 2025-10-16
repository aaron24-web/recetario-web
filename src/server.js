const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes'); // <-- IMPORTAR

// Inicialización
const app = express();

// Middlewares
app.use(express.json());

// Documentación de la API con Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.get('/', (req, res) => {
  res.send('¡API de Recetario funcionando!');
});

// Usar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes); // <-- USAR

module.exports = app;