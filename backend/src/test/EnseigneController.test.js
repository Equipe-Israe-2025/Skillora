import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  assignerFilieres,
  recupererFilieresEncadrant,
  retirerFiliere
} from './EnseigneController.js';
import {
  affecterFilieresAEncadrant,
  getFilieresByEncadrant,
  retirerFiliereAEncadrant
} from '../services/EnseigneService.js';

// Mock des services
vi.mock('../services/EnseigneService.js', () => ({
  affecterFilieresAEncadrant: vi.fn(),
  getFilieresByEncadrant: vi.fn(),
  retirerFiliereAEncadrant: vi.fn()
}));

describe('Enseigne Controller - Integration Tests', () => {
  let req, res;
  let enseigneService;

  beforeEach(async () => {
    // Réinitialiser tous les mocks
    vi.resetAllMocks();
    
    // Importer le service après le mock pour obtenir les références mockées
    enseigneService = await import('../services/EnseigneService.js');
    
    // Configurer les objets req/res simulés
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
    it('should assign filieres to encadrant successfully', async () => {
      const mockResult = { success: true, count: 3 };
      enseigneService.affecterFilieresAEncadrant.mockResolvedValue(mockResult);
      req.body = {
        numSum: 'ENC123',
        listeIdFiliere: [1, 2, 3]
      };

      await assignerFilieres(req, res);

      expect(enseigneService.affecterFilieresAEncadrant).toHaveBeenCalledWith(
        'ENC123',
        [1, 2, 3]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle errors when assigning filieres', async () => {
      const error = new Error('Database connection failed');
      enseigneService.affecterFilieresAEncadrant.mockRejectedValue(error);
      req.body = {
        numSum: 'ENC123',
        listeIdFiliere: [1, 2, 3]
      };

      await assignerFilieres(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database connection failed' });
    });
  });

  describe('recupererFilieresEncadrant', () => {
    it('should get filieres for encadrant successfully', async () => {
      const mockFilieres = [
        { id: 1, nom: 'Informatique' },
        { id: 2, nom: 'Mathématiques' }
      ];
      enseigneService.getFilieresByEncadrant.mockResolvedValue(mockFilieres);
      req.params = { numSum: 'ENC123' };

      await recupererFilieresEncadrant(req, res);

      expect(enseigneService.getFilieresByEncadrant).toHaveBeenCalledWith('ENC123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFilieres);
    });

    it('should handle errors when getting filieres', async () => {
      const error = new Error('Encadrant not found');
      enseigneService.getFilieresByEncadrant.mockRejectedValue(error);
      req.params = { numSum: 'ENC999' };

      await recupererFilieresEncadrant(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Encadrant not found' });
    });
  });

  describe('retirerFiliere', () => {
    it('should remove filiere from encadrant successfully', async () => {
      const mockResult = { success: true };
      enseigneService.retirerFiliereAEncadrant.mockResolvedValue(mockResult);
      req.params = {
        numSum: 'ENC123',
        idFiliere: '1'
      };

      await retirerFiliere(req, res);

      expect(enseigneService.retirerFiliereAEncadrant).toHaveBeenCalledWith(
        'ENC123',
        '1'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle errors when removing filiere', async () => {
      const error = new Error('Association not found');
      enseigneService.retirerFiliereAEncadrant.mockRejectedValue(error);
      req.params = {
        numSum: 'ENC123',
        idFiliere: '999'
      };

      await retirerFiliere(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Association not found' });
    });
  });
});