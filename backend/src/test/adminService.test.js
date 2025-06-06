import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Mock des modules
vi.mock('bcrypt');
vi.mock('jsonwebtoken');
vi.mock('../sync.js', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const AdministrateurMock = dbMock.define('Administrateur', {
    Id_A: 1,
    Id_U: 1
  });

  const UtilisateurMock = dbMock.define('Utilisateur', {
    Id_U: 1,
    nom: 'Admin',
    prenom: 'Test',
    email: 'admin.test@example.com',
    password: bcrypt.hashSync('securePassword123', 10),
    role: 'Administrateur'
  });

  UtilisateurMock.$queryInterface.$useHandler((query, queryOptions) => {
    if (query === 'findOne') {
      if (queryOptions[0].where.email === 'admin.test@example.com') {
        return Promise.resolve({
          Id_U: 1,
          ...queryOptions[0].where,
          password: '$2b$10$examplehashedpassword',
          Administrateur: { Id_A: 1, Id_U: 1 }
        });
      }
      return Promise.resolve(null);
    }
  });

  return {
    Administrateur: AdministrateurMock,
    Utilisateur: UtilisateurMock,
    sequelize: { sync: vi.fn(), close: vi.fn() }
  };
});

import { Administrateur, Utilisateur } from '../sync.js';
import { createAdmin, authenticateAdmin } from './adminService.js';

dotenv.config();

describe('Admin Authentication Integration Tests', () => {
  const adminData = {
    nom: 'Admin',
    prenom: 'Test',
    email: 'admin.test@example.com',
    password: 'securePassword123',
    role: 'Administrateur'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    bcrypt.hash.mockResolvedValue('$2b$10$examplehashedpassword');
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake.jwt.token');
  });

  describe('authenticateAdmin', () => {
    it('should authenticate an admin with valid credentials', async () => {
      const result = await authenticateAdmin({
        email: adminData.email,
        password: adminData.password,
        role: adminData.role
      });

      expect(result.token).toBe('fake.jwt.token');
      expect(result.admin).toBeDefined();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        adminData.password,
        expect.any(String)
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: expect.any(Number), role: adminData.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    });
  });
});
