const request = require('supertest');
const app = require('../../src/app');
const dbClient = require('../../src/config/database');
const User = require('../../src/models/User');

// Mock de dbClient para pruebas
jest.mock('../../src/config/database');

describe('User API', () => {
  const mockDbClient = {
    query: jest.fn()
  };

  beforeAll(() => {
    // Inyectar mock en el módulo
    dbClient.query = mockDbClient.query;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('debería obtener todos los usuarios (requiere autenticación)', async () => {
      const usersData = [
        { id: 1, nombre: 'User 1', email: 'user1@example.com', password: 'hash1', fecha_registro: new Date().toISOString() },
        { id: 2, nombre: 'User 2', email: 'user2@example.com', password: 'hash2', fecha_registro: new Date().toISOString() }
      ];

      // Mock para simular un token válido
      jest.mock('../../src/services/authService', () => {
        return jest.fn().mockImplementation(() => {
          return {
            verifyToken: jest.fn().mockReturnValue({ id: 1, email: 'test@example.com' })
          };
        });
      });

      mockDbClient.query.mockResolvedValue(usersData);

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(mockDbClient.query).toHaveBeenCalledWith('SELECT * FROM usuarios ORDER BY id ASC');
    });
  });

  // ... más pruebas para otros endpoints
});