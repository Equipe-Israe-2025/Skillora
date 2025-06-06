import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock des services
vi.mock('../services/IndicateurService.js', () => ({
  createIndicateur: vi.fn(),
  getAllIndicateurs: vi.fn(),
  getIndicateursByCompetence: vi.fn(),
  updateIndicateur: vi.fn(),
  deleteIndicateur: vi.fn()
}));

import {
  createIndicateur,
  getAllIndicateurs,
  getIndicateursByCompetence,
  updateIndicateur,
  deleteIndicateur
} from '../services/IndicateurService.js';

import {
  create,
  getAll,
  getIndicateursByComp,
  update,
  supprimer
} from './IndicateurController.js';


const app = express();
app.use(express.json());
app.post('/indicateurs', create);
app.get('/indicateurs', getAll);
app.get('/indicateurs/competence/:id', getIndicateursByComp);
app.put('/indicateurs/:id', update);
app.delete('/indicateurs/:id', supprimer);

describe('IndicateurController - Tests d\'Intégration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /indicateurs', () => {
    it('devrait créer un indicateur avec succès (201)', async () => {
      const mockIndicateur = { id: 1, nom: 'Taux de réussite', description: 'Description' };
      createIndicateur.mockResolvedValue(mockIndicateur);

      const res = await request(app)
        .post('/indicateurs')
        .send({ nom: 'Taux de réussite', description: 'Description' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockIndicateur);
      expect(createIndicateur).toHaveBeenCalledWith({
        nom: 'Taux de réussite',
        description: 'Description'
      });
    });

    it('devrait retourner 400 en cas de données invalides', async () => {
      const errorMessage = 'Données invalides';
      createIndicateur.mockRejectedValue(new Error(errorMessage));

      const res = await request(app)
        .post('/indicateurs')
        .send({}); // Données manquantes

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: errorMessage });
    });
  });

  describe('GET /indicateurs', () => {
    it('devrait retourner tous les indicateurs (200)', async () => {
      const mockIndicateurs = [
        { id: 1, nom: 'Indicateur 1' },
        { id: 2, nom: 'Indicateur 2' }
      ];
      getAllIndicateurs.mockResolvedValue(mockIndicateurs);

      const res = await request(app).get('/indicateurs');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockIndicateurs);
    });

    it('devrait retourner 500 en cas d\'erreur serveur', async () => {
      const errorMessage = 'Erreur de base de données';
      getAllIndicateurs.mockRejectedValue(new Error(errorMessage));

      const res = await request(app).get('/indicateurs');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: errorMessage });
    });
  });

  describe('GET /indicateurs/competence/:id', () => {
    it('devrait retourner les indicateurs par compétence (200)', async () => {
      const mockIndicateurs = [
        { id: 1, nom: 'Indicateur Compétence 1' },
        { id: 2, nom: 'Indicateur Compétence 2' }
      ];
      getIndicateursByCompetence.mockResolvedValue(mockIndicateurs);

      const res = await request(app).get('/indicateurs/competence/123');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockIndicateurs);
      expect(getIndicateursByCompetence).toHaveBeenCalledWith('123');
    });

    it('devrait retourner 500 si la récupération échoue', async () => {
      const errorMessage = 'Erreur de récupération';
      getIndicateursByCompetence.mockRejectedValue(new Error(errorMessage));

      const res = await request(app).get('/indicateurs/competence/123');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: errorMessage });
    });
  });

  describe('PUT /indicateurs/:id', () => {
    it('devrait mettre à jour un indicateur existant (200)', async () => {
      const mockUpdated = { id: 1, nom: 'Indicateur Mis à Jour' };
      updateIndicateur.mockResolvedValue(mockUpdated);

      const res = await request(app)
        .put('/indicateurs/1')
        .send({ nom: 'Indicateur Mis à Jour' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUpdated);
      expect(updateIndicateur).toHaveBeenCalledWith(
        '1',
        { nom: 'Indicateur Mis à Jour' }
      );
    });

    it('devrait retourner 400 si la mise à jour échoue', async () => {
      const errorMessage = 'Échec de la mise à jour';
      updateIndicateur.mockRejectedValue(new Error(errorMessage));

      const res = await request(app)
        .put('/indicateurs/1')
        .send({ nom: '' }); // Donnée invalide

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: errorMessage });
    });
  });

  describe('DELETE /indicateurs/:id', () => {
    it('devrait supprimer un indicateur existant (200)', async () => {
      const mockResult = { success: true, message: 'Indicateur supprimé' };
      deleteIndicateur.mockResolvedValue(mockResult);

      const res = await request(app).delete('/indicateurs/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResult);
      expect(deleteIndicateur).toHaveBeenCalledWith('1');
    });

    it('devrait retourner 400 si la suppression échoue', async () => {
      const errorMessage = 'Échec de la suppression';
      deleteIndicateur.mockRejectedValue(new Error(errorMessage));

      const res = await request(app).delete('/indicateurs/999');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: errorMessage });
    });
  });
});