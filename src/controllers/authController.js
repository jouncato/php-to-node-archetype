const AuthService = require('../services/authService');
const UserRepository = require('../repositories/userRepository');

// Inyección de dependencias manual
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

class AuthController {
  /**
   * Iniciar sesión
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      // No enviar el token en el body si se usa HttpOnly cookie, pero para APIs REST es común
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error.message === 'Credenciales inválidas') {
        // Código 401 para credenciales inválidas
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      // Código 500 para errores internos
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }
}

module.exports = new AuthController();