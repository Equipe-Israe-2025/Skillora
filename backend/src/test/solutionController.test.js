import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

// Mock des services
vi.mock('../services/solutionService.js', () => ({
  createSolutionService: vi.fn(),
  getAllSolutionsService: vi.fn(),
  deleteSolutionService: vi.fn(),
  updateSolutionService: vi.fn()
}));

import {
  createSolutionService,
  getAllSolutionsService,
  deleteSolutionService,
  updateSolutionService
} from '../services/solutionService.js';

import {
  createSolution,
  getAllSolutions,
  deleteSolution,
  updateSolution
} from './solutionController.js';

// Configuration de l'application Express de test
const app = express();
app.use(bodyParser.json());

// Routes
app.post('/solutions', createSolution);
app.get('/solutions', getAllSolutions);
app.delete('/solutions/:id', deleteSolution);
app.put('/solutions/:id', updateSolution);

describe('SolutionController - Tests d\'Intégration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /solutions', () => {
    it('devrait créer une solution avec succès (201)', async () => {
      const mockSolution = {
        id: 1,
        description: 'Solution test',
        signalementId: 1
      };
      createSolutionService.mockResolvedValue(mockSolution);

      const res = await request(app)
        .post('/solutions')
        .send({
          description: 'Solution test',
          signalementId: 1
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        message: 'Solution créée et liée au signalement avec succès.',
        solution: mockSolution
      });
      expect(createSolutionService).toHaveBeenCalledWith({
        description: 'Solution test',
        signalementId: 1
      });
    });

    it('devrait retourner 500 en cas d\'erreur', async () => {
      createSolutionService.mockRejectedValue(new Error('Erreur de base de données'));

      const res = await request(app)
        .post('/solutions')
        .send({
          description: 'Solution test',
          signalementId: 1
        });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Erreur de base de données'
      });
    });
  });

  describe('GET /solutions', () => {
    it('devrait récupérer toutes les solutions (200)', async () => {
      const mockSolutions = [
        { id: 1, description: 'Solution 1', signalementId: 1 },
        { id: 2, description: 'Solution 2', signalementId: 2 }
      ];
      getAllSolutionsService.mockResolvedValue(mockSolutions);

      const res = await request(app).get('/solutions');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockSolutions);
      expect(getAllSolutionsService).toHaveBeenCalled();
    });

    it('devrait retourner 500 en cas d\'erreur', async () => {
      getAllSolutionsService.mockRejectedValue(new Error('Erreur de récupération'));

      const res = await request(app).get('/solutions');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Erreur de récupération'
      });
    });
  });

  describe('DELETE /solutions/:id', () => {
    it('devrait supprimer une solution avec succès (200)', async () => {
      deleteSolutionService.mockResolvedValue();

      const res = await request(app).delete('/solutions/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'Solution et liens supprimés avec succès.'
      });
      expect(deleteSolutionService).toHaveBeenCalledWith('1');
    });

    it('devrait retourner 500 en cas d\'erreur', async () => {
      deleteSolutionService.mockRejectedValue(new Error('Erreur de suppression'));

      const res = await request(app).delete('/solutions/1');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Erreur de suppression'
      });
    });
  });

  describe('PUT /solutions/:id', () => {
    it('devrait mettre à jour une solution avec succès (200)', async () => {
      const mockUpdatedSolution = {
        id: 1,
        description: 'Solution mise à jour',
        signalementId: 1
      };
      updateSolutionService.mockResolvedValue(mockUpdatedSolution);

      const res = await request(app)
        .put('/solutions/1')
        .send({
          description: 'Solution mise à jour'
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'Solution mise à jour avec succès.',
        solution: mockUpdatedSolution
      });
      expect(updateSolutionService).toHaveBeenCalledWith('1', {
        description: 'Solution mise à jour'
      });
    });

    it('devrait retourner 500 en cas d\'erreur', async () => {
      updateSolutionService.mockRejectedValue(new Error('Erreur de mise à jour'));

      const res = await request(app)
        .put('/solutions/1')
        .send({
          description: 'Solution mise à jour'
        });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Erreur de mise à jour'
      });
    });
  });
});