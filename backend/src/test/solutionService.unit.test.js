// backend/src/services/solutionService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createSolutionService,
  getAllSolutionsService,
  deleteSolutionService,
  updateSolutionService
} from './solutionService.js';

// Mock du module sync.js
vi.mock('../sync.js', () => {
  const Solution_Proposee = {
    create: vi.fn(),
    findAll: vi.fn(),
    findByPk: vi.fn(),
    destroy: vi.fn(),
  };

  const Proposer = {
    create: vi.fn(),
    destroy: vi.fn(),
  };

  return {
    Solution_Proposee,
    Proposer,
    sequelize: {},
    Sequelize: class {},
  };
});

import { Solution_Proposee, Proposer } from '../sync.js';

describe('Solution Service - tests unitaires', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSolutionService', () => {
    it('devrait créer une solution et un lien dans Proposer', async () => {
      const payload = {
        type: 'type1',
        nom: 'Solution A',
        description: 'Description A',
        dateDebut: '2025-01-01',
        dateFin: '2025-01-10',
        Id_S: 3
      };

      const mockSolution = { Id_SP: 101, ...payload };
      Solution_Proposee.create.mockResolvedValue(mockSolution);
      Proposer.create.mockResolvedValue({});

      const result = await createSolutionService(payload);

      expect(Solution_Proposee.create).toHaveBeenCalledWith({
        type: payload.type,
        nom: payload.nom,
        description: payload.description,
        dateDebut: payload.dateDebut,
        dateFin: payload.dateFin,
      });

      expect(Proposer.create).toHaveBeenCalledWith({
        Id_S: payload.Id_S,
        Id_SP: mockSolution.Id_SP,
      });

      expect(result).toEqual(mockSolution);
    });

    it('devrait lancer une erreur si Id_S est manquant', async () => {
      const payload = {
        type: 'X',
        nom: 'No Link',
        description: 'Desc',
        dateDebut: '2025-01-01',
        dateFin: '2025-01-05',
      };

      await expect(createSolutionService(payload)).rejects.toThrow('Id_S (Signalement) est requis pour lier la solution.');
    });
  });

  describe('getAllSolutionsService', () => {
    it('devrait retourner toutes les solutions', async () => {
      const solutions = [{ Id_SP: 1 }, { Id_SP: 2 }];
      Solution_Proposee.findAll.mockResolvedValue(solutions);

      const result = await getAllSolutionsService();

      expect(Solution_Proposee.findAll).toHaveBeenCalled();
      expect(result).toEqual(solutions);
    });
  });

  describe('deleteSolutionService', () => {
    it('devrait supprimer le lien Proposer et la solution', async () => {
      const id = 42;
      Proposer.destroy.mockResolvedValue(1);
      Solution_Proposee.destroy.mockResolvedValue(1);

      const result = await deleteSolutionService(id);

      expect(Proposer.destroy).toHaveBeenCalledWith({ where: { Id_SP: id } });
      expect(Solution_Proposee.destroy).toHaveBeenCalledWith({ where: { Id_SP: id } });
      expect(result).toBe(1);
    });

    it('devrait lancer une erreur si la solution n\'existe pas', async () => {
      const id = 99;
      Proposer.destroy.mockResolvedValue(0);
      Solution_Proposee.destroy.mockResolvedValue(0);

      await expect(deleteSolutionService(id)).rejects.toThrow('Solution non trouvée.');
    });
  });

  describe('updateSolutionService', () => {
    it('devrait mettre à jour les champs fournis', async () => {
      const id = 10;
      const existing = {
        type: 'Old',
        nom: 'Old Name',
        description: 'Old desc',
        dateDebut: '2024-01-01',
        dateFin: '2024-02-01',
        save: vi.fn().mockResolvedValue(),
      };
      Solution_Proposee.findByPk.mockResolvedValue(existing);

      const updates = { nom: 'New Name', description: 'Updated description' };

      const result = await updateSolutionService(id, updates);

      expect(existing.nom).toBe('New Name');
      expect(existing.description).toBe('Updated description');
      expect(existing.save).toHaveBeenCalled();
      expect(result).toBe(existing);
    });

    it('devrait lancer une erreur si la solution n\'existe pas', async () => {
      Solution_Proposee.findByPk.mockResolvedValue(null);
      await expect(updateSolutionService(404, {})).rejects.toThrow('Solution non trouvée.');
    });
  });
});
