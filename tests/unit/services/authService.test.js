const { mock } = require('jest-mock-extended');
const AuthService = require('../../../src/services/authService');
const UserRepository = require('../../../src/repositories/userRepository');
const User = require('../../../src/models/User');
const jwt = require('jsonwebtoken');
const config = require('../../../src/config/environment');

jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = mock(UserRepository);
    authService = new AuthService(mockUserRepository);
    jest.resetAllMocks();
  });

  describe('login', () => {
    it('debería iniciar sesión exitosamente con credenciales válidas', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const userData = {
        id: 1,
        nombre: 'Test User',
        email: credentials.email,
        password: '$2a$10$examplehash', // bcrypt hash de 'password123'
        fecha_registro: new Date()
      };
      const user = new User(userData);

      const mockToken = 'mock-jwt-token';

      // Mocks
      mockUserRepository.findByEmail.mockResolvedValue(user);
      require('bcryptjs').compare = jest.fn().mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const result = await authService.login(credentials.email, credentials.password);

      expect(result).toEqual({
        token: mockToken,
        user: user.toJSON()
      });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
      expect(require('bcryptjs').compare).toHaveBeenCalledWith(credentials.password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user.id, email: user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
    });

    it('debería lanzar un error con credenciales inválidas (email no encontrado)', async () => {
      const credentials = {
        email: 'notfound@example.com',
        password: 'password123'
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(credentials.email, credentials.password))
        .rejects
        .toThrow('Credenciales inválidas');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
      expect(require('bcryptjs').compare).not.toHaveBeenCalled();
    });

    it('debería lanzar un error con credenciales inválidas (contraseña incorrecta)', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const userData = {
        id: 1,
        nombre: 'Test User',
        email: credentials.email,
        password: '$2a$10$examplehash',
        fecha_registro: new Date()
      };
      const user = new User(userData);

      mockUserRepository.findByEmail.mockResolvedValue(user);
      require('bcryptjs').compare = jest.fn().mockResolvedValue(false);

      await expect(authService.login(credentials.email, credentials.password))
        .rejects
        .toThrow('Credenciales inválidas');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
      expect(require('bcryptjs').compare).toHaveBeenCalledWith(credentials.password, user.password);
    });
  });

  describe('verifyToken', () => {
    it('debería verificar un token válido', () => {
      const token = 'valid-token';
      const decoded = { id: 1, email: 'test@example.com' };

      jwt.verify.mockReturnValue(decoded);

      const result = authService.verifyToken(token);

      expect(result).toEqual(decoded);
      expect(jwt.verify).toHaveBeenCalledWith(token, config.jwt.secret);
    });

    it('debería lanzar un error con un token inválido', () => {
      const token = 'invalid-token';

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.verifyToken(token)).toThrow('Token inválido o expirado');
      expect(jwt.verify).toHaveBeenCalledWith(token, config.jwt.secret);
    });
  });
});