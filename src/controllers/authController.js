const AuthService = require('../services/authService');
const UserRepository = require('../repositories/userRepository');

// Inyección de dependencias manual
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

class AuthController {
  // Iniciar sesión
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error.message === 'Credenciales inválidas') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }
}

module.exports = new AuthController();