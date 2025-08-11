// Funciones auxiliares reutilizables

const helpers = {
  // Verificar si un valor es un número entero válido
  isInteger: (value) => {
    return Number.isInteger(Number(value));
  },

  // Generar un ID único simple (para ejemplos)
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Formatear fechas
  formatDate: (date) => {
    return new Date(date).toISOString().split('T')[0];
  }
};

module.exports = helpers;