src/app.jsconst express = require('express');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/error');
const logger = require('./utils/logger');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Migración PHP a Node.js',
    version: '1.0.0'
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

module.exports = app;