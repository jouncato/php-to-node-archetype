const dbClient = require('../config/database');
const User = require('../models/User');
const logger = require('../utils/logger');

class UserRepository {
  // Crear un nuevo usuario
  async create(userData) {
    const user = new User(userData);
    const query = `
      INSERT INTO usuarios (nombre, email, password, fecha_registro)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      user.nombre,
      user.email,
      user.password, // Ya debe venir hasheado desde el servicio
      user.fecha_registro
    ];

    try {
      const result = await dbClient.query(query, params);
      user.id = result.insertId;
      logger.info(`Usuario creado con ID: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Error al crear usuario en el repositorio:', error);
      throw error;
    }
  }

  // Obtener todos los usuarios
  async findAll() {
    const query = 'SELECT * FROM usuarios ORDER BY id ASC';
    
    try {
      const rows = await dbClient.query(query);
      return rows.map(row => new User(row));
    } catch (error) {
      logger.error('Error al obtener todos los usuarios:', error);
      throw error;
    }
  }

  // Obtener un usuario por ID
  async findById(id) {
    const query = 'SELECT * FROM usuarios WHERE id = ?';
    const params = [id];

    try {
      const rows = await dbClient.query(query, params);
      if (rows.length === 0) return null;
      return new User(rows[0]);
    } catch (error) {
      logger.error(`Error al obtener usuario por ID ${id}:`, error);
      throw error;
    }
  }

  // Obtener un usuario por email
  async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const params = [email];

    try {
      const rows = await dbClient.query(query, params);
      if (rows.length === 0) return null;
      return new User(rows[0]);
    } catch (error) {
      logger.error(`Error al obtener usuario por email ${email}:`, error);
      throw error;
    }
  }

  // Actualizar un usuario
  async update(id, userData) {
    const user = new User({ id, ...userData });
    const query = `
      UPDATE usuarios
      SET nombre = ?, email = ?
      WHERE id = ?
    `;
    const params = [user.nombre, user.email, user.id];

    try {
      await dbClient.query(query, params);
      logger.info(`Usuario actualizado con ID: ${user.id}`);
      return user;
    } catch (error) {
      logger.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  }

  // Eliminar un usuario
  async delete(id) {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    const params = [id];

    try {
      const result = await dbClient.query(query, params);
      const deleted = result.affectedRows > 0;
      if (deleted) {
        logger.info(`Usuario eliminado con ID: ${id}`);
      } else {
        logger.warn(`No se encontró usuario para eliminar con ID: ${id}`);
      }
      return deleted;
    } catch (error) {
      logger.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = UserRepository;