const testUsers = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    password: '$2a$10$examplehash1', // bcrypt hash de 'password123'
    fecha_registro: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    nombre: 'Ana Gómez',
    email: 'ana.gomez@example.com',
    password: '$2a$10$examplehash2', // bcrypt hash de 'password456'
    fecha_registro: '2023-01-02T00:00:00.000Z'
  }
];

module.exports = testUsers;