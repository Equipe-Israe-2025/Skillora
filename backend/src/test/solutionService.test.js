import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Mock des modules
vi.mock('../sync.js', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  // Modèle Solution_Proposee
  const SolutionMock = dbMock.define('Solution_Proposee', {
    Id_SP: 1,
    type: 'Type 1',
    nom: 'Solution Test',
    description: 'Description test',
    dateDebut: new Date(),
    dateFin: new Date()
  });

  // Modèle Proposer (table de liaison)
  const ProposerMock = dbMock.define('Proposer', {
    Id_S: 1,
    Id_SP: 1
  });

  // Création de spies pour les méthodes
  const solutionCreateSpy = vi.fn().mockImplementation((data) => 
    Promise.resolve({ Id_SP: 2, ...data })
  );
  
  const solutionFindAllSpy = vi.fn().mockResolvedValue([
    { 
      Id_SP: 1, 
      type: 'Type 1', 
      nom: 'Solution 1', 
      description: 'Desc 1',
      dateDebut: new Date('2023-01-01'),
      dateFin: new Date('2023-12-31')
    },
    { 
      Id_SP: 2, 
      type: 'Type 2', 
      nom: 'Solution 2', 
      description: 'Desc 2',
      dateDebut: new Date('2023-02-01'),
      dateFin: new Date('2023-11-30')
    }
  ]);

  const solutionDestroySpy = vi.fn().mockImplementation((options) => 
    options.where.Id_SP === 1 ? Promise.resolve(1) : Promise.resolve(0)
  );

  const solutionFindByPkSpy = vi.fn().mockImplementation((id) => {
    if (id === 1) {
      return Promise.resolve({
        Id_SP: 1,
        type: 'Type 1',
        nom: 'Solution 1',
        description: 'Description 1',
        dateDebut: new Date(),
        dateFin: new Date(),
        save: vi.fn().mockResolvedValue(true)
      });
    }
    return Promise.resolve(null);
  });

  const proposerCreateSpy = vi.fn().mockResolvedValue({ Id_S: 1, Id_SP: 1 });
  const proposerDestroySpy = vi.fn().mockResolvedValue(1);

  // Assignation des spies aux méthodes
  SolutionMock.create = solutionCreateSpy;
  SolutionMock.findAll = solutionFindAllSpy;
  SolutionMock.destroy = solutionDestroySpy;
  SolutionMock.findByPk = solutionFindByPkSpy;
  
  ProposerMock.create = proposerCreateSpy;
  ProposerMock.destroy = proposerDestroySpy;

  return {
    Solution_Proposee: SolutionMock,
    Proposer: ProposerMock,
    sequelize: { sync: vi.fn(), close: vi.fn() }
  };
});

dotenv.config();

import { Solution_Proposee, Proposer } from '../sync.js';
import {
  createSolutionService,
  getAllSolutionsService,
  deleteSolutionService,
  updateSolutionService
} from './solutionService.js';

describe('Solution Service - Integration Tests', () => {
  const testSolution = {
    type: 'Corrective',
    nom: 'Solution Test',
    description: 'Description de test',
    dateDebut: new Date(),
    dateFin: new Date(),
    Id_S: 1
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSolutionService', () => {
    it('should create a new solution and link it to a signalement', async () => {
      const result = await createSolutionService(testSolution);
      
      expect(result).toMatchObject({
        Id_SP: expect.any(Number),
        type: testSolution.type,
        nom: testSolution.nom,
        description: testSolution.description
      });
      
      expect(Solution_Proposee.create).toHaveBeenCalledWith({
        type: testSolution.type,
        nom: testSolution.nom,
        description: testSolution.description,
        dateDebut: testSolution.dateDebut,
        dateFin: testSolution.dateFin
      });
      
      expect(Proposer.create).toHaveBeenCalledWith({
        Id_S: testSolution.Id_S,
        Id_SP: result.Id_SP
      });
    });

    it('should throw error when Id_S is missing', async () => {
      const invalidData = { ...testSolution, Id_S: undefined };
      await expect(createSolutionService(invalidData)).rejects.toThrow(
        'Id_S (Signalement) est requis pour lier la solution.'
      );
    });
  });

  describe('getAllSolutionsService', () => {
    it('should return all solutions', async () => {
      const result = await getAllSolutionsService();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('Id_SP');
      expect(result[0]).toHaveProperty('type');
      expect(result[0]).toHaveProperty('nom');
      
      expect(Solution_Proposee.findAll).toHaveBeenCalled();
    });
  });

  describe('deleteSolutionService', () => {
    it('should delete a solution and its relations', async () => {
      const result = await deleteSolutionService(1);
      expect(result).toBe(1);
      
      expect(Proposer.destroy).toHaveBeenCalledWith({ where: { Id_SP: 1 } });
      expect(Solution_Proposee.destroy).toHaveBeenCalledWith({ where: { Id_SP: 1 } });
    });

    it('should throw error when solution does not exist', async () => {
      await expect(deleteSolutionService(999)).rejects.toThrow(
        'Solution non trouvée.'
      );
    });
  });

  describe('updateSolutionService', () => {
    it('should update solution fields', async () => {
      const updates = {
        nom: 'Nouveau nom',
        description: 'Nouvelle description',
        dateFin: new Date('2024-12-31')
      };

      const result = await updateSolutionService(1, updates);
      
      expect(result.nom).toBe(updates.nom);
      expect(result.description).toBe(updates.description);
      expect(result.dateFin).toEqual(updates.dateFin);
      expect(result.save).toHaveBeenCalled();
    });

    it('should throw error when solution does not exist', async () => {
      await expect(updateSolutionService(999, { nom: 'Test' })).rejects.toThrow(
        'Solution non trouvée.'
      );
    });
  });
});

