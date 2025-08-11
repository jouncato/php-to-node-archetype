const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const UserRepository = require('../repositories/userRepository');
const logger = require('../utils/logger');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Iniciar sesión de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} Token JWT y datos del usuario
   */
  async login(email, password) {
    if (!email || !password) {
      logger.warn('Intento de inicio de sesión con datos incompletos');
      throw new Error('Email y contraseña son obligatorios');
    }

    try {
      // Buscar usuario por email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        // Es importante no revelar si el email existe o no por razones de seguridad
        logger.warn(`Intento de inicio de sesión fallido para email no registrado: ${email}`);
        throw new Error('Credenciales inválidas');
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        logger.warn(`Intento de inicio de sesión fallido para usuario: ${email} (contraseña incorrecta)`);
        throw new Error('Credenciales inválidas');
      }

      // Generar token JWT con un tiempo de expiración más corto
      const token = jwt.sign(
        { id: user.id, email: user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn || '1h' } // Por defecto 1 hora
      );

      logger.info(`Autenticación exitosa para el usuario ID: ${user.id}`);
      return {
        token,
        user: user.toJSON() // Devolver datos del usuario sin password
      };
    } catch (error) {
      if (error.message === 'Credenciales inválidas') {
        // Re-lanzar error específico para que el controlador lo maneje
        throw error;
      }
      logger.error('Error en el servicio de autenticación:', error);
      throw new Error('Error en el proceso de inicio de sesión');
    }
  }

  /**
   * Verificar token JWT
   * @param {string} token - Token JWT a verificar
   * @returns {Object} Datos decodificados del token
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      return decoded;
    } catch (error) {
      logger.warn('Token JWT inválido o expirado');
      throw new Error('Token inválido o expirado');
    }
  }
}

module.exports = AuthService;