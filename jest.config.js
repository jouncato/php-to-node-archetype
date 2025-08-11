module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js', // Excluir punto de entrada
    '!src/app.js',    // Excluir configuración de app
    '!src/config/**', // Excluir configuraciones
    '!src/utils/logger.js' // Excluir logger
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: []
};