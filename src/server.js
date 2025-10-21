const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const tagRoutes = require('./routes/tagRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const errorHandler = require('./middlewares/errorHandler'); // <-- NUEVO: 1. Importar el manejador
const profileRoutes = require('./routes/profileRoutes');

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
app.use('/api/recipes', recipeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/profile', profileRoutes);

// <-- NUEVO: 2. Usar el manejador de errores
// IMPORTANTE: Debe ir DESPUÉS de todas tus rutas.
app.use(errorHandler);

module.exports = app;