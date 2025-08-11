const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Configuración de Helmet para headers de seguridad
const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  // Ocultar el header X-Powered-By
  hidePoweredBy: true,
});

// Configuración de CORS
// En producción, restringir origin a tu dominio frontend
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGIN || 'https://sample-dominio.com' 
    : '*', // En desarrollo permitir todo
  optionsSuccessStatus: 200 // Algunos navegadores antiguos (IE11, varias SmartTVs) se atascan en 204
};

const corsMiddleware = cors(corsOptions);

// Limitador de tasa global para todas las solicitudes
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventanaMs
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, por favor inténtalo de nuevo más tarde.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  }
});
// Limitador de tasa específico para autenticación
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 intentos de login por ventanaMs
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Cuenta bloqueada temporalmente.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar solicitudes exitosas
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}, Email: ${req.body.email || 'N/A'}`);
    res.status(options.statusCode).send(options.message);
  }
});

module.exports = {
  helmetMiddleware,
  corsMiddleware,
  globalRateLimiter,
  authRateLimiter
};