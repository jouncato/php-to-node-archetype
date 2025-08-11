const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error('Error no manejado:', err);

  // Error de Joi (validación)
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: err.details[0].message
    });
  }

  // Error de autenticación
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o no proporcionado'
    });
  }

  // Error por defecto
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
}

module.exports = errorHandler;