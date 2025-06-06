import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as BadgeService from './BadgeService.js';
import * as pdfService from './pdfService.js';
import * as db from '../sync.js';

// Mocks globaux
vi.mock('./pdfService.js', () => ({
  createPDF: vi.fn()
}));

vi.mock('../sync.js', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  return {
    Badge: dbMock.define('Badge'),
    Evaluation: dbMock.define('Evaluation'),
    Utilisateur: dbMock.define('Utilisateur'),
    Indicateur: dbMock.define('Indicateur'),
    Competence: dbMock.define('Competence')
  };
});

describe('BadgeService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateBadge', () => {
    it('should generate badge if evaluation note is sufficient', async () => {
      const evaluationMock = {
  note: 4,
  commentaire: 'Bien joué',
  createdAt: new Date(), 
  Indicateur: {
    Competence: { nom: 'Algo' }
  },
  evaluateur: {
    prenom: 'Jane',
    nom: 'Smith'
  },
  evalue: {
    prenom: 'John',
    nom: 'Doe'
  }
};

      db.Evaluation.findByPk = vi.fn().mockResolvedValue(evaluationMock);
      pdfService.createPDF.mockResolvedValue('/fake/path.pdf');
      db.Badge.create = vi.fn().mockResolvedValue({
        nom: 'Badge - Algo',
        lien: '/fake/path.pdf'
      });

      const result = await BadgeService.generateBadge(1);
      expect(db.Evaluation.findByPk).toHaveBeenCalledWith(1, expect.anything());
      expect(pdfService.createPDF).toHaveBeenCalled();
      expect(db.Badge.create).toHaveBeenCalled();
      expect(result.nom).toContain('Badge -');
      expect(result.lien).toBe('/fake/path.pdf');
    });

    it('should throw if evaluation not found', async () => {
      db.Evaluation.findByPk = vi.fn().mockResolvedValue(null);
      await expect(BadgeService.generateBadge(999)).rejects.toThrow('Évaluation non trouvée');
    });

    it('should throw if note is insufficient', async () => {
      db.Evaluation.findByPk = vi.fn().mockResolvedValue({ note: 2 });
      await expect(BadgeService.generateBadge(2)).rejects.toThrow('Note insuffisante pour un badge');
    });
  });

  describe('getBadgeByEvaluation', () => {
    it('should return badge if exists', async () => {
      const badge = { id_evaluation: 1, nom: 'Badge - Test' };
      db.Badge.findOne = vi.fn().mockResolvedValue(badge);
      const result = await BadgeService.getBadgeByEvaluation(1);
      expect(db.Badge.findOne).toHaveBeenCalledWith({ where: { id_evaluation: 1 } });
      expect(result).toEqual(badge);
    });

    it('should return null if badge not found', async () => {
      db.Badge.findOne = vi.fn().mockResolvedValue(null);
      const result = await BadgeService.getBadgeByEvaluation(999);
      expect(result).toBeNull();
    });
  });

  describe('downloadBadge', () => {
    it('should return badge path if badge exists', async () => {
      const badge = { lien: '/badge/path.pdf' };
      db.Badge.findByPk = vi.fn().mockResolvedValue(badge);
      const result = await BadgeService.downloadBadge(1);
      expect(result).toBe('/badge/path.pdf');
    });

    it('should throw if badge not found', async () => {
      db.Badge.findByPk = vi.fn().mockResolvedValue(null);
      await expect(BadgeService.downloadBadge(999)).rejects.toThrow('Badge non trouvé');
    });
  });
});
