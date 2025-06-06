import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as badgeService from '../services/BadgeService.js';
import {
  generateBadge,
  getBadgeByEvaluation,
  downloadBadge
} from './BadgeController.js';

// Mock du service BadgeService
vi.mock('../services/BadgeService.js', () => ({
  generateBadge: vi.fn(),
  getBadgeByEvaluation: vi.fn(),
  downloadBadge: vi.fn()
}));

describe('Badge Controller - Integration Tests', () => {
  let req, res;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
    
    // Configurer des objets req/res de base
    req = {
      params: {}
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      download: vi.fn()
    };
  });

  describe('generateBadge', () => {
    it('devrait générer un badge avec succès et retourner 201', async () => {
      const mockBadge = { id: 1, evaluationId: '123', name: 'Badge Test' };
      badgeService.generateBadge.mockResolvedValue(mockBadge);
      req.params.evaluationId = '123';

      await generateBadge(req, res);

      expect(badgeService.generateBadge).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBadge);
    });

    it('devrait retourner 400 en cas d\'erreur', async () => {
      const errorMessage = 'Erreur de génération';
      badgeService.generateBadge.mockRejectedValue(new Error(errorMessage));
      req.params.evaluationId = '123';

      await generateBadge(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getBadgeByEvaluation', () => {
    it('devrait retourner un badge existant', async () => {
      const mockBadge = { id: 1, evaluationId: '123', name: 'Badge Test' };
      badgeService.getBadgeByEvaluation.mockResolvedValue(mockBadge);
      req.params.evaluationId = '123';

      await getBadgeByEvaluation(req, res);

      expect(badgeService.getBadgeByEvaluation).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith(mockBadge);
    });

    it('devrait retourner 404 si le badge n\'existe pas', async () => {
      badgeService.getBadgeByEvaluation.mockResolvedValue(null);
      req.params.evaluationId = '123';

      await getBadgeByEvaluation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Badge non trouvé' });
    });

    it('devrait retourner 500 en cas d\'erreur serveur', async () => {
      const errorMessage = 'Erreur de base de données';
      badgeService.getBadgeByEvaluation.mockRejectedValue(new Error(errorMessage));
      req.params.evaluationId = '123';

      await getBadgeByEvaluation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('downloadBadge', () => {
    it('devrait initier le téléchargement du badge', async () => {
      const mockFilePath = '/path/to/badge.png';
      badgeService.downloadBadge.mockResolvedValue(mockFilePath);
      req.params.badgeId = '1';

      await downloadBadge(req, res);

      expect(badgeService.downloadBadge).toHaveBeenCalledWith('1');
      expect(res.download).toHaveBeenCalledWith(mockFilePath);
    });

    it('devrait retourner 500 en cas d\'erreur de téléchargement', async () => {
      const errorMessage = 'Erreur de fichier';
      badgeService.downloadBadge.mockRejectedValue(new Error(errorMessage));
      req.params.badgeId = '1';

      await downloadBadge(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});