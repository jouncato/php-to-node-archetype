const express = require('express');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/error');
const logger = require('./utils/logger');
// Importar nuevas protecciones
const { 
  helmetMiddleware, 
  corsMiddleware, 
  globalRateLimiter 
} = require('./middleware/security');

const app = express();

// Aplicar middleware de seguridad
app.use(helmetMiddleware); // Headers de seguridad
app.use(corsMiddleware);   // Configuración de CORS
app.use(globalRateLimiter); // Limitador de tasa global

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' })); // Limitar tamaño del body

// Rutas
// Aplicar rate limiter específico para autenticación
const { authRateLimiter } = require('./middleware/security');
app.use('/api/auth/login', authRateLimiter); // Aplicar antes de la ruta
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