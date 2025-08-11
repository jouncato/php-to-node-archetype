const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/userRepository');
const User = require('../models/User');
const logger = require('../utils/logger');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // Crear un nuevo usuario (con hash de contraseña)
  async createUser(nombre, email, password) {
    // Validaciones básicas
    if (!nombre || !email || !password) {
      throw new Error('Nombre, email y contraseña son obligatorios');
    }

    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el objeto de usuario
    const userData = {
      nombre,
      email,
      password: hashedPassword
    };

    try {
      const newUser = await this.userRepository.create(userData);
      logger.info(`Servicio: Usuario creado con éxito - ID: ${newUser.id}`);
      return newUser.toJSON(); // Devolver sin password
    } catch (error) {
      logger.error('Servicio: Error al crear usuario:', error);
      throw new Error('No se pudo crear el usuario');
    }
  }

  // Obtener todos los usuarios
  async getAllUsers() {
    try {
      const users = await this.userRepository.findAll();
      logger.info('Servicio: Usuarios obtenidos con éxito');
      return users.map(user => user.toJSON());
    } catch (error) {
      logger.error('Servicio: Error al obtener usuarios:', error);
      throw new Error('No se pudieron obtener los usuarios');
    }
  }

  // Obtener un usuario por ID
  async getUserById(id) {
    if (!id) {
      throw new Error('ID de usuario es obligatorio');
    }

    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      logger.info(`Servicio: Usuario encontrado - ID: ${id}`);
      return user.toJSON();
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        throw error; // Re-lanzar error específico
      }
      logger.error(`Servicio: Error al obtener usuario por ID ${id}:`, error);
      throw new Error('No se pudo obtener el usuario');
    }
  }

  // Actualizar un usuario
  async updateUser(id, nombre, email) {
    if (!id) {
      throw new Error('ID de usuario es obligatorio');
    }

    // Validaciones básicas
    if (!nombre || !email) {
      throw new Error('Nombre y email son obligatorios para la actualización');
    }

    try {
      // Verificar si el usuario existe
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error('Usuario no encontrado');
      }

      // Actualizar datos
      const updatedData = { nombre, email };
      const updatedUser = await this.userRepository.update(id, updatedData);
      logger.info(`Servicio: Usuario actualizado con éxito - ID: ${id}`);
      return updatedUser.toJSON();
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        throw error; // Re-lanzar error específico
      }
      logger.error(`Servicio: Error al actualizar usuario con ID ${id}:`, error);
      throw new Error('No se pudo actualizar el usuario');
    }
  }

  // Eliminar un usuario
  async deleteUser(id) {
    if (!id) {
      throw new Error('ID de usuario es obligatorio');
    }

    try {
      const isDeleted = await this.userRepository.delete(id);
      if (!isDeleted) {
        throw new Error('Usuario no encontrado');
      }
      logger.info(`Servicio: Usuario eliminado con éxito - ID: ${id}`);
      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        throw error; // Re-lanzar error específico
      }
      logger.error(`Servicio: Error al eliminar usuario con ID ${id}:`, error);
      throw new Error('No se pudo eliminar el usuario');
    }
  }
}

module.exports = UserService;