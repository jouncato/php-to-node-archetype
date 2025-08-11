const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const config = {
  // Configuración de la base de datos
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'php_migration',
    port: parseInt(process.env.DB_PORT) || 3306
  },

  // Configuración del servidor
  server: {
    port: parseInt(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Configuración de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

module.exports = config;