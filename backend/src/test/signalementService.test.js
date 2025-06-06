import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Mock des modules
vi.mock('../sync.js', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const SignalementMock = dbMock.define('Signalement', {
    Id_S: 1,
    description: 'Test signalement',
    CNE: 'ABC123',
    Id_U: 1
  });

  // Création de spies pour les méthodes
  const createSpy = vi.fn().mockImplementation((data) => 
    Promise.resolve({ Id_S: 2, ...data })
  );
  const findAllSpy = vi.fn().mockResolvedValue([
    { Id_S: 1, description: 'Signalement 1', CNE: 'CNE001', Id_U: 1 },
    { Id_S: 2, description: 'Signalement 2', CNE: 'CNE002', Id_U: 1 }
  ]);
  const destroySpy = vi.fn().mockImplementation((options) => 
    options.where.Id_S === 1 ? Promise.resolve(1) : Promise.resolve(0)
  );

  // Assignation des spies aux méthodes du modèle
  SignalementMock.create = createSpy;
  SignalementMock.findAll = findAllSpy;
  SignalementMock.destroy = destroySpy;

  return {
    Signalement: SignalementMock,
    sequelize: { sync: vi.fn(), close: vi.fn() }
  };
});

dotenv.config();

import { Signalement } from '../sync.js';
import {
  createSignalementService,
  getAllSignalementsService,
  deleteSignalementService
} from './signalementService.js';

describe('Signalement Service - Integration Tests', () => {
  const testSignalement = {
    description: 'Nouveau signalement',
    CNE: 'TEST456',
    Id_U: 1
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSignalementService', () => {
    it('should create a new signalement and return it', async () => {
      const result = await createSignalementService(testSignalement);
      
      expect(result).toMatchObject({
        Id_S: expect.any(Number),
        description: testSignalement.description,
        CNE: testSignalement.CNE,
        Id_U: testSignalement.Id_U
      });
      
      // Vérification avec le spy
      expect(Signalement.create).toHaveBeenCalledWith(testSignalement);
    });
  });

  describe('getAllSignalementsService', () => {
    it('should return all signalements', async () => {
      const result = await getAllSignalementsService();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('Id_S');
      expect(result[0]).toHaveProperty('description');
      
      expect(Signalement.findAll).toHaveBeenCalled();
    });
  });

  describe('deleteSignalementService', () => {
    it('should delete an existing signalement', async () => {
      const result = await deleteSignalementService(1);
      expect(result).toBe(1);
      expect(Signalement.destroy).toHaveBeenCalledWith({ where: { Id_S: 1 } });
    });

    it('should throw an error when signalement does not exist', async () => {
      await expect(deleteSignalementService(999)).rejects.toThrow(
        'Signalement non trouvé.'
      );
    });
  });
});