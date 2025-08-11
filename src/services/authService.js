const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const UserRepository = require('../repositories/userRepository');
const logger = require('../utils/logger');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // Iniciar sesión
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email y contraseña son obligatorios');
    }

    try {
      // Buscar usuario por email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }

      // Generar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      logger.info(`Autenticación exitosa para el usuario: ${email}`);
      return {
        token,
        user: user.toJSON() // Devolver datos del usuario sin password
      };
    } catch (error) {
      if (error.message === 'Credenciales inválidas') {
        logger.warn(`Intento de inicio de sesión fallido para: ${email}`);
        throw error; // Re-lanzar error específico
      }
      logger.error('Error en el servicio de autenticación:', error);
      throw new Error('Error en el proceso de inicio de sesión');
    }
  }

  // Verificar token (para middleware)
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