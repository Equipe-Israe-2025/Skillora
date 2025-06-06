import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateBadge, getBadgeByEvaluation, downloadBadge } from './BadgeService.js';

// Mock des modules
vi.mock('./pdfService.js', () => ({
  createPDF: vi.fn().mockResolvedValue('/path/to/badge.pdf')
}));

vi.mock('../sync.js', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const CompetenceMock = dbMock.define('Competence', {
    id: 1,
    nom: 'Test Competence'
  });

  const IndicateurMock = dbMock.define('Indicateur', {
    id: 1,
    Competence: CompetenceMock.build({ id: 1, nom: 'Test Competence' })
  });

  const UtilisateurMock = dbMock.define('Utilisateur', {
    id: 1,
    nom: 'Doe',
    prenom: 'John',
    email: 'john.doe@example.com'
  });

  const EvaluationMock = dbMock.define('Evaluation', {
    id: 1,
    note: 4,
    commentaire: 'Excellent travail',
    createdAt: new Date(),
    Indicateur: IndicateurMock.build(),
    evaluateur: UtilisateurMock.build({ id: 2, nom: 'Smith', prenom: 'Jane' }),
    evalue: UtilisateurMock.build({ id: 1, nom: 'Doe', prenom: 'John' })
  });

  const BadgeMock = dbMock.define('Badge', {
    id: 1,
    nom: 'Badge - Test Competence',
    lien: '/path/to/badge.pdf',
    id_evaluation: 1
  });

  // Implémentation manuelle de findByPk pour Evaluation
  EvaluationMock.findByPk = vi.fn((id) => {
    if (id === 1) {
      return Promise.resolve(EvaluationMock.build({
        note: 4,
        Indicateur: IndicateurMock.build(),
        evaluateur: UtilisateurMock.build(),
        evalue: UtilisateurMock.build()
      }));
    }
    if (id === 2) {
      return Promise.resolve(EvaluationMock.build({ note: 3 }));
    }
    return Promise.resolve(null);
  });

  // Implémentation manuelle de findByPk pour Badge
  BadgeMock.findByPk = vi.fn((id) => {
    if (id === 1) {
      return Promise.resolve(BadgeMock.build());
    }
    return Promise.resolve(null);
  });

  // Implémentation manuelle de findOne pour Badge
  BadgeMock.findOne = vi.fn((options) => {
    if (options.where.id_evaluation === 1) {
      return Promise.resolve(BadgeMock.build());
    }
    return Promise.resolve(null);
  });

  return {
    Badge: BadgeMock,
    Evaluation: EvaluationMock,
    Utilisateur: UtilisateurMock,
    Competence: CompetenceMock,
    Indicateur: IndicateurMock,
    sequelize: { sync: vi.fn(), close: vi.fn() }
  };
});

describe('BadgeService Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateBadge', () => {
    it('should generate a badge for evaluation with sufficient note', async () => {
      const badge = await generateBadge(1);
      
      expect(badge).toBeDefined();
      expect(badge.nom).toContain('Badge -');
      expect(badge.lien).toBe('/path/to/badge.pdf');
    });

    it('should throw error if evaluation not found', async () => {
      await expect(generateBadge(999)).rejects.toThrow('Évaluation non trouvée');
    });

    it('should throw error if note is insufficient', async () => {
      await expect(generateBadge(2)).rejects.toThrow('Note insuffisante pour un badge');
    });
  });

  describe('getBadgeByEvaluation', () => {
    it('should return badge for existing evaluation', async () => {
      const badge = await getBadgeByEvaluation(1);
      expect(badge).toBeDefined();
      expect(badge.id_evaluation).toBe(1);
    });

    it('should return null for non-existing evaluation badge', async () => {
      const badge = await getBadgeByEvaluation(999);
      expect(badge).toBeNull();
    });
  });

  describe('downloadBadge', () => {
    it('should return badge path for existing badge', async () => {
      const path = await downloadBadge(1);
      expect(path).toBe('/path/to/badge.pdf');
    });

    it('should throw error for non-existing badge', async () => {
      await expect(downloadBadge(999)).rejects.toThrow('Badge non trouvé');
    });
  });
});