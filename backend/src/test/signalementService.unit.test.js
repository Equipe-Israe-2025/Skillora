// backend/src/services/signalementService.test.js

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createSignalementService,
  getAllSignalementsService,
  deleteSignalementService,
} from './signalementService.js';
import { Signalement } from '../sync.js';

// Mock du module sync.js
vi.mock('../sync.js', () => ({
  Signalement: {
    create: vi.fn(),
    findAll: vi.fn(),
    destroy: vi.fn(),
  },
}));

describe('Signalement Service - tests unitaires', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSignalementService', () => {
    it('devrait créer un signalement et retourner l\'objet créé', async () => {
      const payload = { description: 'Test signalement', CNE: 'ABC123', Id_U: 7 };
      const mockCreated = { Id_S: 42, ...payload };

      Signalement.create.mockResolvedValue(mockCreated);

      const result = await createSignalementService(payload);

      expect(Signalement.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockCreated);
    });

    it('devrait propager l\'erreur si Signalement.create échoue', async () => {
      const payload = { description: 'Test', CNE: 'XYZ', Id_U: 5 };
      const error = new Error('DB error');
      Signalement.create.mockRejectedValue(error);

      await expect(createSignalementService(payload)).rejects.toThrow('DB error');
      expect(Signalement.create).toHaveBeenCalledWith(payload);
    });
  });

  describe('getAllSignalementsService', () => {
    it('devrait retourner la liste des signalements', async () => {
      const mockList = [
        { Id_S: 1, description: 'Desc 1', CNE: 'AAA', Id_U: 2 },
        { Id_S: 2, description: 'Desc 2', CNE: 'BBB', Id_U: 3 },
      ];

      Signalement.findAll.mockResolvedValue(mockList);

      const result = await getAllSignalementsService();

      expect(Signalement.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockList);
    });

    it('devrait propager l\'erreur si Signalement.findAll échoue', async () => {
      const error = new Error('FindAll error');
      Signalement.findAll.mockRejectedValue(error);

      await expect(getAllSignalementsService()).rejects.toThrow('FindAll error');
      expect(Signalement.findAll).toHaveBeenCalled();
    });
  });

  describe('deleteSignalementService', () => {
    it('devrait supprimer un signalement existant et retourner 1', async () => {
      const id = 10;
      Signalement.destroy.mockResolvedValue(1);

      const result = await deleteSignalementService(id);

      expect(Signalement.destroy).toHaveBeenCalledWith({ where: { Id_S: id } });
      expect(result).toBe(1);
    });

    it('devrait lancer une erreur si aucun signalement supprimé (destroy retourne 0)', async () => {
      const id = 999;
      Signalement.destroy.mockResolvedValue(0);

      await expect(deleteSignalementService(id)).rejects.toThrow('Signalement non trouvé.');
      expect(Signalement.destroy).toHaveBeenCalledWith({ where: { Id_S: id } });
    });

    it('devrait propager l\'erreur si Signalement.destroy échoue', async () => {
      const id = 5;
      const error = new Error('Destroy error');
      Signalement.destroy.mockRejectedValue(error);

      await expect(deleteSignalementService(id)).rejects.toThrow('Destroy error');
      expect(Signalement.destroy).toHaveBeenCalledWith({ where: { Id_S: id } });
    });
  });
});
