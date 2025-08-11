const AuthService = require('../services/authService');
const UserRepository = require('../repositories/userRepository');
const logger = require('../utils/logger');

// Inyección de dependencias manual
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

function authMiddleware(req, res, next) {
  // Obtener el token del header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    logger.warn(`Intento de acceso sin token de autenticación desde IP: ${req.ip}`);
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. Se requiere token de autenticación.'
    });
  }

  try {
    // Verificar el token
    const decoded = authService.verifyToken(token);
    req.user = decoded; // Agregar info del usuario al request
    logger.info(`Usuario autenticado: ID ${decoded.id}, Email ${decoded.email}`);
    next();
  } catch (error) {
    logger.warn(`Token de autenticación inválido o expirado desde IP: ${req.ip}`);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
}

module.exports = authMiddleware;