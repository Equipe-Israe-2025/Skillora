import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createSolution,
  getAllSolutions,
  deleteSolution,
  updateSolution
} from './solutionController.js';

// Mock des dépendances problématiques
vi.mock('../config/db.js', () => ({}));

// Mock complet des services
vi.mock('../services/solutionService.js', () => ({
  createSolutionService: vi.fn(),
  getAllSolutionsService: vi.fn(),
  deleteSolutionService: vi.fn(),
  updateSolutionService: vi.fn()
}));

// Import des mocks après leur configuration
import * as solutionService from '../services/solutionService.js';

describe('Solution Controller - Unit Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Réinitialisation des mocks
    vi.resetAllMocks();

    // Configuration des objets mockés
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    
    mockRes = {
      status: vi.fn(() => mockRes), // Permet le chaînage
      json: vi.fn(),
      send: vi.fn(),
      end: vi.fn()
    };
  });

  describe('createSolution', () => {
    it('should create a solution and return 201 status', async () => {
      // Données de test
      const mockSolution = {
        id: 1,
        description: 'Nouvelle solution',
        signalementId: 1
      };
      mockReq.body = {
        description: 'Nouvelle solution',
        signalementId: 1
      };
      solutionService.createSolutionService.mockResolvedValue(mockSolution);

      // Appel de la fonction
      await createSolution(mockReq, mockRes);

      // Vérifications
      expect(solutionService.createSolutionService).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Solution créée et liée au signalement avec succès.',
        solution: mockSolution
      });
    });

    it('should return 500 status on service error', async () => {
      mockReq.body = { description: 'Solution erronée' };
      const errorMessage = 'Erreur de création';
      solutionService.createSolutionService.mockRejectedValue(new Error(errorMessage));

      await createSolution(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });
  });

  describe('getAllSolutions', () => {
    it('should return all solutions with 200 status', async () => {
      const mockSolutions = [
        { id: 1, description: 'Solution 1' },
        { id: 2, description: 'Solution 2' }
      ];
      solutionService.getAllSolutionsService.mockResolvedValue(mockSolutions);

      await getAllSolutions(mockReq, mockRes);

      expect(solutionService.getAllSolutionsService).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockSolutions);
    });

    it('should return 500 status on service error', async () => {
      const errorMessage = 'Erreur de récupération';
      solutionService.getAllSolutionsService.mockRejectedValue(new Error(errorMessage));

      await getAllSolutions(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });
  });

  describe('deleteSolution', () => {
    it('should delete solution and return 200 status', async () => {
      mockReq.params.id = '123';
      solutionService.deleteSolutionService.mockResolvedValue();

      await deleteSolution(mockReq, mockRes);

      expect(solutionService.deleteSolutionService).toHaveBeenCalledWith('123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Solution et liens supprimés avec succès.'
      });
    });

    it('should return 500 status on service error', async () => {
      mockReq.params.id = '123';
      const errorMessage = 'Erreur de suppression';
      solutionService.deleteSolutionService.mockRejectedValue(new Error(errorMessage));

      await deleteSolution(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });
  });

  describe('updateSolution', () => {
    it('should update solution and return 200 status', async () => {
      const mockUpdatedSolution = {
        id: 1,
        description: 'Solution mise à jour'
      };
      mockReq.params.id = '1';
      mockReq.body = { description: 'Solution mise à jour' };
      solutionService.updateSolutionService.mockResolvedValue(mockUpdatedSolution);

      await updateSolution(mockReq, mockRes);

      expect(solutionService.updateSolutionService).toHaveBeenCalledWith(
        '1',
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Solution mise à jour avec succès.',
        solution: mockUpdatedSolution
      });
    });

    it('should return 500 status on service error', async () => {
      mockReq.params.id = '1';
      mockReq.body = { description: 'Mauvaise mise à jour' };
      const errorMessage = 'Erreur de mise à jour';
      solutionService.updateSolutionService.mockRejectedValue(new Error(errorMessage));

      await updateSolution(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: errorMessage
      });
    });
  });
});