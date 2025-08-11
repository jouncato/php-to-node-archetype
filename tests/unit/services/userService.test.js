const { mock } = require('jest-mock-extended');
const UserService = require('../../../src/services/userService');
const UserRepository = require('../../../src/repositories/userRepository');
const User = require('../../../src/models/User');

describe('UserService', () => {
  let userService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = mock(UserRepository);
    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('debería crear un usuario exitosamente', async () => {
      const userData = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const hashedPassword = '$2a$10$examplehash';
      const createdUser = new User({ ...userData, id: 1, password: hashedPassword });

      // Mocks
      require('bcryptjs').hash = jest.fn().mockResolvedValue(hashedPassword);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(userData.nombre, userData.email, userData.password);

      expect(result).toEqual(createdUser.toJSON());
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(require('bcryptjs').hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        nombre: userData.nombre,
        email: userData.email,
        password: hashedPassword
      });
    });

    it('debería lanzar un error si el email ya existe', async () => {
      const userData = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const existingUser = new User({ id: 1, ...userData, password: '$2a$10$examplehash' });
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(userService.createUser(userData.nombre, userData.email, userData.password))
        .rejects
        .toThrow('El email ya está registrado');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('debería obtener todos los usuarios', async () => {
      const usersData = [
        { id: 1, nombre: 'User 1', email: 'user1@example.com', password: 'hash1', fecha_registro: new Date() },
        { id: 2, nombre: 'User 2', email: 'user2@example.com', password: 'hash2', fecha_registro: new Date() }
      ];
      const users = usersData.map(data => new User(data));

      mockUserRepository.findAll.mockResolvedValue(users);

      const result = await userService.getAllUsers();

      expect(result).toEqual(users.map(user => user.toJSON()));
      expect(mockUserRepository.findAll).toHaveBeenCalled();
    });
  });

  // ... más pruebas para otros métodos
});