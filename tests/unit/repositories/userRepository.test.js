const UserRepository = require('../../../src/repositories/userRepository');
const dbClient = require('../../../src/config/database');
const User = require('../../../src/models/User');

// Mock de dbClient
jest.mock('../../../src/config/database');

describe('UserRepository', () => {
  let userRepository;
  const mockDbClient = {
    query: jest.fn()
  };

  beforeEach(() => {
    userRepository = new UserRepository();
    userRepository.db = mockDbClient; // Inyectar mock
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear un usuario en la base de datos', async () => {
      const userData = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        fecha_registro: new Date()
      };
      const user = new User(userData);
      const insertId = 1;

      mockDbClient.query.mockResolvedValue([{ insertId }]);

      const result = await userRepository.create(userData);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(insertId);
      expect(mockDbClient.query).toHaveBeenCalledWith(
        'INSERT INTO usuarios (nombre, email, password, fecha_registro) VALUES (?, ?, ?, ?)',
        [userData.nombre, userData.email, userData.password, userData.fecha_registro]
      );
    });
  });

  describe('findAll', () => {
    it('debería obtener todos los usuarios', async () => {
      const usersData = [
        { id: 1, nombre: 'User 1', email: 'user1@example.com', password: 'hash1', fecha_registro: new Date() },
        { id: 2, nombre: 'User 2', email: 'user2@example.com', password: 'hash2', fecha_registro: new Date() }
      ];

      mockDbClient.query.mockResolvedValue(usersData);

      const result = await userRepository.findAll();

      expect(result).toHaveLength(2);
      result.forEach((user, index) => {
        expect(user).toBeInstanceOf(User);
        expect(user.id).toBe(usersData[index].id);
      });
      expect(mockDbClient.query).toHaveBeenCalledWith('SELECT * FROM usuarios ORDER BY id ASC');
    });
  });

  // ... más pruebas para findById, findByEmail, update, delete
});