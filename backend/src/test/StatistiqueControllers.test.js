import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

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

const app = express();
app.use(express.json());

// Ajout des routes simulées
app.get('/moyenne-par-competence', moyenneParCompetenceController);
app.get('/rapport-json', rapportJSONController);
app.get('/rapport-pdf', rapportPDFController);

afterEach(() => {
  vi.clearAllMocks();
});

describe('StatistiqueControllers - Tests d\'Intégration', () => {
  describe('GET /moyenne-par-competence', () => {
    it('devrait retourner la moyenne par compétence (200)', async () => {
      const mockData = [{ competence: 'C1', moyenne: 15 }];
      getMoyenneParCompetence.mockResolvedValue(mockData);

      const res = await request(app).get('/moyenne-par-competence');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(getMoyenneParCompetence).toHaveBeenCalled();
    });

    it('devrait retourner 500 en cas d\'erreur', async () => {
      getMoyenneParCompetence.mockRejectedValue(new Error('Erreur interne'));

      const res = await request(app).get('/moyenne-par-competence');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Erreur interne' });
    });
  });

  describe('GET /rapport-json', () => {
    it('devrait retourner le rapport JSON (200)', async () => {
      const mockRapport = [{ competence: 'C1', score: 80 }];
      getRapportParCompetence.mockResolvedValue(mockRapport);

      const res = await request(app).get('/rapport-json');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockRapport);
      expect(getRapportParCompetence).toHaveBeenCalled();
    });

    it('devrait retourner 500 en cas d\'erreur', async () => {
      getRapportParCompetence.mockRejectedValue(new Error('Erreur JSON'));

      const res = await request(app).get('/rapport-json');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: 'Erreur lors de la récupération du rapport',
        error: 'Erreur JSON',
      });
    });
  });

  describe('GET /rapport-pdf', () => {
    it('devrait générer un rapport PDF et déclencher le téléchargement (200)', async () => {
      const mockRapport = [{ competence: 'C1', score: 80 }];
      getRapportParCompetence.mockResolvedValue(mockRapport);
      generatePDFReport.mockResolvedValue(); // Simuler que le fichier est généré

      // On remplace res.download pour capturer l'appel
      const fakeDownload = vi.fn((_path, _filename) => {
        // Appel express fictif
        return;
      });

      // Création d'une fausse requête Express
      const res = {
        status: vi.fn(() => res),
        json: vi.fn(),
        download: fakeDownload,
      };

      const req = {};

      await rapportPDFController(req, res);

      expect(getRapportParCompetence).toHaveBeenCalled();
      expect(generatePDFReport).toHaveBeenCalledWith(mockRapport, './rapport.pdf');
      expect(fakeDownload).toHaveBeenCalledWith('./rapport.pdf', 'rapport_evaluations.pdf');
    });

    it('devrait retourner 500 en cas d\'erreur PDF', async () => {
      getRapportParCompetence.mockRejectedValue(new Error('Erreur PDF'));

      const res = {
        status: vi.fn(() => res),
        json: vi.fn(),
      };

      const req = {};

      await rapportPDFController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erreur lors de la génération du PDF',
        error: 'Erreur PDF',
      });
    });
  });
});
