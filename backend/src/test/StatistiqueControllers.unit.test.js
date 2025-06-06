import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock des services
vi.mock('../services/StatistiqueService.js', () => ({
  getMoyenneParCompetence: vi.fn(),
  getRapportParCompetence: vi.fn(),
}));

vi.mock('../services/pdfService.js', () => ({
  generatePDFReport: vi.fn(),
}));

import {
  getMoyenneParCompetence,
  getRapportParCompetence,
} from '../services/StatistiqueService.js';

import { generatePDFReport } from '../services/pdfService.js';

import {
  moyenneParCompetenceController,
  rapportJSONController,
  rapportPDFController,
} from './StatistiqueControllers.js';

afterEach(() => {
  vi.clearAllMocks();
});

describe('StatistiqueControllers - Tests unitaires', () => {
  describe('moyenneParCompetenceController', () => {
    it('doit retourner 200 et les données en cas de succès', async () => {
      const mockData = [{ competence: 'C1', moyenne: 14 }];
      getMoyenneParCompetence.mockResolvedValue(mockData);

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await moyenneParCompetenceController(req, res);

      expect(getMoyenneParCompetence).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('doit retourner 500 en cas d\'erreur', async () => {
      getMoyenneParCompetence.mockRejectedValue(new Error('Erreur'));

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await moyenneParCompetenceController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erreur' });
    });
  });

  describe('rapportJSONController', () => {
    it('doit retourner 200 avec le rapport', async () => {
      const mockRapport = [{ competence: 'C1', note: 18 }];
      getRapportParCompetence.mockResolvedValue(mockRapport);

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await rapportJSONController(req, res);

      expect(getRapportParCompetence).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRapport);
    });

    it('doit retourner 500 en cas d\'erreur', async () => {
      getRapportParCompetence.mockRejectedValue(new Error('Erreur JSON'));

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await rapportJSONController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erreur lors de la récupération du rapport',
        error: 'Erreur JSON',
      });
    });
  });

  describe('rapportPDFController', () => {
    it('doit appeler generatePDFReport et déclencher res.download', async () => {
      const mockRapport = [{ competence: 'C2', note: 15 }];
      getRapportParCompetence.mockResolvedValue(mockRapport);
      generatePDFReport.mockResolvedValue();

      const req = {};
      const res = {
        download: vi.fn(),
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await rapportPDFController(req, res);

      expect(getRapportParCompetence).toHaveBeenCalled();
      expect(generatePDFReport).toHaveBeenCalledWith(mockRapport, './rapport.pdf');
      expect(res.download).toHaveBeenCalledWith('./rapport.pdf', 'rapport_evaluations.pdf');
    });

    it('doit retourner 500 si une erreur survient', async () => {
      getRapportParCompetence.mockRejectedValue(new Error('Erreur PDF'));

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await rapportPDFController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erreur lors de la génération du PDF',
        error: 'Erreur PDF',
      });
    });
  });
});
