import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

vi.mock('bcrypt');
vi.mock('jsonwebtoken');
vi.mock('../sync.js', () => {
  const AdministrateurMock = {};
  return {
    Utilisateur: {
      findOne: vi.fn()
    },
    Administrateur: AdministrateurMock
  };
});

import { authenticateAdmin } from './adminService.js';
import { Utilisateur, Administrateur } from '../sync.js';

describe('authenticateAdmin (unit test)', () => {
  const mockUser = {
    Id_U: 1,
    email: 'admin.test@example.com',
    password: '$2b$10$examplehashedpassword',
    role: 'Administrateur',
    Administrateur: { Id_A: 1, Id_U: 1 }
  };

  const credentials = {
    email: 'admin.test@example.com',
    password: 'securePassword123',
    role: 'Administrateur'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Utilisateur.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake.jwt.token');
  });

  it('should authenticate and return token and admin data', async () => {
    const result = await authenticateAdmin(credentials);

    expect(Utilisateur.findOne).toHaveBeenCalledWith({
      where: {
        email: credentials.email,
        role: credentials.role
      },
      include: {
        model: Administrateur,
        as: 'Administrateur'
      }
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      credentials.password,
      mockUser.password
    );

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.Id_U, role: credentials.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    expect(result).toEqual({
      token: 'fake.jwt.token',
      admin: mockUser
    });
  });
});
