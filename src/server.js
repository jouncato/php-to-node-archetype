const app = require('./app');
const config = require('./config/environment');
const logger = require('./utils/logger');
const dbClient = require('./config/database');

const PORT = config.server.port;

// Iniciar el servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en el puerto ${PORT}`);
  logger.info(`🔧 Entorno: ${config.server.env}`);
});

// Manejar cierre limpio de la aplicación
process.on('SIGINT', async () => {
  logger.info('Apagando servidor...');
  await dbClient.close();
  process.exit(0);
});