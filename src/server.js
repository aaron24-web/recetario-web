const express = require('express');

// Inicialización
const app = express();

// Middlewares
app.use(express.json()); // Para entender los JSON que lleguen en el body

// Rutas
app.get('/', (req, res) => {
  res.send('¡API de Recetario funcionando!');
});

module.exports = app;