import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateBadge,
  getBadgeByEvaluation,
  downloadBadge
} from './BadgeController.js';

// Mock des dépendances
vi.mock('../services/BadgeService.js', () => ({
  generateBadge: vi.fn(),
  getBadgeByEvaluation: vi.fn(),
  downloadBadge: vi.fn()
}));

describe('Badge Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    vi.resetAllMocks();
    
    // Configurer des objets req/res de base
    req = {
      params: {}
    };
    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      download: vi.fn()
    };
  });

  describe('generateBadge', () => {
    it('should call service and return 201 with badge data on success', async () => {
      const mockBadge = { id: 1, name: 'Test Badge' };
      const { generateBadge: mockGenerate } = await import('../services/BadgeService.js');
      mockGenerate.mockResolvedValue(mockBadge);
      req.params.evaluationId = 'eval123';

      await generateBadge(req, res);

      expect(mockGenerate).toHaveBeenCalledWith('eval123');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBadge);
    });

    it('should return 400 with error message on failure', async () => {
      const error = new Error('Generation failed');
      const { generateBadge: mockGenerate } = await import('../services/BadgeService.js');
      mockGenerate.mockRejectedValue(error);
      req.params.evaluationId = 'eval123';

      await generateBadge(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Generation failed' });
    });
  });

  describe('getBadgeByEvaluation', () => {
    it('should return badge if found', async () => {
      const mockBadge = { id: 1, name: 'Found Badge' };
      const { getBadgeByEvaluation: mockGet } = await import('../services/BadgeService.js');
      mockGet.mockResolvedValue(mockBadge);
      req.params.evaluationId = 'eval123';

      await getBadgeByEvaluation(req, res);

      expect(mockGet).toHaveBeenCalledWith('eval123');
      expect(res.json).toHaveBeenCalledWith(mockBadge);
    });

    it('should return 404 if badge not found', async () => {
      const { getBadgeByEvaluation: mockGet } = await import('../services/BadgeService.js');
      mockGet.mockResolvedValue(null);
      req.params.evaluationId = 'eval123';

      await getBadgeByEvaluation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Badge non trouvé' });
    });

    it('should return 500 on service error', async () => {
      const error = new Error('Database error');
      const { getBadgeByEvaluation: mockGet } = await import('../services/BadgeService.js');
      mockGet.mockRejectedValue(error);
      req.params.evaluationId = 'eval123';

      await getBadgeByEvaluation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('downloadBadge', () => {
    it('should initiate file download when badge exists', async () => {
      const mockPath = '/path/to/badge.png';
      const { downloadBadge: mockDownload } = await import('../services/BadgeService.js');
      mockDownload.mockResolvedValue(mockPath);
      req.params.badgeId = 'badge123';

      await downloadBadge(req, res);

      expect(mockDownload).toHaveBeenCalledWith('badge123');
      expect(res.download).toHaveBeenCalledWith(mockPath);
    });

    it('should return 500 on download error', async () => {
      const error = new Error('File error');
      const { downloadBadge: mockDownload } = await import('../services/BadgeService.js');
      mockDownload.mockRejectedValue(error);
      req.params.badgeId = 'badge123';

      await downloadBadge(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'File error' });
    });
  });
});