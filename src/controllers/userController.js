const UserService = require('../services/userService');
const UserRepository = require('../repositories/userRepository');

// Inyección de dependencias manual
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

class UserController {
  // Obtener todos los usuarios
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor'
      });
    }
  }

  // Obtener un usuario por ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({
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

  // Actualizar un usuario
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { nombre, email } = req.body;
      const updatedUser = await userService.updateUser(id, nombre, email);
      res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'Usuario actualizado correctamente'
      });
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar el usuario'
      });
    }
  }

  // Eliminar un usuario
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({
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

module.exports = new UserController();