import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  assignerFilieres,
  recupererFilieresEncadrant,
  retirerFiliere
} from './EnseigneController.js';

// Mock des fonctions de service
vi.mock('../services/EnseigneService.js', () => ({
  affecterFilieresAEncadrant: vi.fn(),
  getFilieresByEncadrant: vi.fn(),
  retirerFiliereAEncadrant: vi.fn()
}));

// Re-importer les mocks
import * as enseigneService from '../services/EnseigneService.js';

describe('EnseigneController - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      params: {},
      body: {}
    };
    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      send: vi.fn()
    };
  });

  describe('assignerFilieres', () => {
    it('should assign filieres successfully', async () => {
      const mockResult = { success: true, count: 2 };
      enseigneService.affecterFilieresAEncadrant.mockResolvedValue(mockResult);

      req.body = {
        numSum: 'ENC100',
        listeIdFiliere: [1, 2]
      };

      await assignerFilieres(req, res);

      expect(enseigneService.affecterFilieresAEncadrant).toHaveBeenCalledWith('ENC100', [1, 2]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 500 on error', async () => {
      enseigneService.affecterFilieresAEncadrant.mockRejectedValue(new Error('DB error'));

      req.body = {
        numSum: 'ENC100',
        listeIdFiliere: [1, 2]
      };

      await assignerFilieres(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  describe('recupererFilieresEncadrant', () => {
    it('should retrieve filieres successfully', async () => {
      const mockData = [{ id: 1, nom: 'Info' }];
      enseigneService.getFilieresByEncadrant.mockResolvedValue(mockData);

      req.params = { numSum: 'ENC101' };

      await recupererFilieresEncadrant(req, res);

      expect(enseigneService.getFilieresByEncadrant).toHaveBeenCalledWith('ENC101');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle error', async () => {
      enseigneService.getFilieresByEncadrant.mockRejectedValue(new Error('Not found'));

      req.params = { numSum: 'ENC101' };

      await recupererFilieresEncadrant(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('retirerFiliere', () => {
    it('should remove filiere successfully', async () => {
      const mockResponse = { success: true };
      enseigneService.retirerFiliereAEncadrant.mockResolvedValue(mockResponse);

      req.params = { numSum: 'ENC102', idFiliere: '1' };

      await retirerFiliere(req, res);

      expect(enseigneService.retirerFiliereAEncadrant).toHaveBeenCalledWith('ENC102', '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle error', async () => {
      enseigneService.retirerFiliereAEncadrant.mockRejectedValue(new Error('Association not found'));

      req.params = { numSum: 'ENC102', idFiliere: '999' };

      await retirerFiliere(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Association not found' });
    });
  });
});
