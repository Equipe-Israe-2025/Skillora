import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  create,
  getAll,
  getIndicateursByComp,
  update,
  supprimer
} from './IndicateurController.js';

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

describe('IndicateurController - Tests Unitaires', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    vi.resetAllMocks();

    // Configuration des objets mock
    mockReq = {
      body: {},
      params: { id: '1' }
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  describe('create()', () => {
    it('devrait créer un indicateur avec succès (201)', async () => {
      const mockIndicateur = { id: 1, nom: 'Taux de réussite' };
      createIndicateur.mockResolvedValue(mockIndicateur);
      mockReq.body = { nom: 'Taux de réussite' };

      await create(mockReq, mockRes);

      expect(createIndicateur).toHaveBeenCalledWith({ nom: 'Taux de réussite' });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockIndicateur);
    });

    it('devrait retourner 400 en cas d\'erreur de validation', async () => {
      const error = new Error('Nom requis');
      createIndicateur.mockRejectedValue(error);
      mockReq.body = {};

      await create(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Nom requis' });
    });
  });

  describe('getAll()', () => {
    it('devrait retourner tous les indicateurs (200)', async () => {
      const mockIndicateurs = [
        { id: 1, nom: 'Indicateur 1' },
        { id: 2, nom: 'Indicateur 2' }
      ];
      getAllIndicateurs.mockResolvedValue(mockIndicateurs);

      await getAll(mockReq, mockRes);

      expect(getAllIndicateurs).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockIndicateurs);
    });

    it('devrait retourner 500 en cas d\'erreur serveur', async () => {
      const error = new Error('Erreur de base de données');
      getAllIndicateurs.mockRejectedValue(error);

      await getAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Erreur de base de données' });
    });
  });

  describe('getIndicateursByComp()', () => {
    it('devrait retourner les indicateurs par compétence (200)', async () => {
      const mockIndicateurs = [
        { id: 1, nom: 'Indicateur Compétence 1' }
      ];
      getIndicateursByCompetence.mockResolvedValue(mockIndicateurs);
      mockReq.params.id = '123';

      await getIndicateursByComp(mockReq, mockRes);

      expect(getIndicateursByCompetence).toHaveBeenCalledWith('123');
      expect(mockRes.json).toHaveBeenCalledWith(mockIndicateurs);
    });

    it('devrait retourner 500 si la récupération échoue', async () => {
      const error = new Error('Erreur de récupération');
      getIndicateursByCompetence.mockRejectedValue(error);
      mockReq.params.id = '123';

      await getIndicateursByComp(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Erreur de récupération' });
    });
  });

  describe('update()', () => {
    it('devrait mettre à jour un indicateur existant (200)', async () => {
      const mockUpdated = { id: 1, nom: 'Nouveau nom' };
      updateIndicateur.mockResolvedValue(mockUpdated);
      mockReq.body = { nom: 'Nouveau nom' };

      await update(mockReq, mockRes);

      expect(updateIndicateur).toHaveBeenCalledWith('1', { nom: 'Nouveau nom' });
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdated);
    });

    it('devrait retourner 400 si la mise à jour échoue', async () => {
      const error = new Error('Échec de la mise à jour');
      updateIndicateur.mockRejectedValue(error);
      mockReq.body = { nom: '' };

      await update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Échec de la mise à jour' });
    });
  });

  describe('supprimer()', () => {
    it('devrait supprimer un indicateur existant (200)', async () => {
      const mockResult = { success: true };
      deleteIndicateur.mockResolvedValue(mockResult);

      await supprimer(mockReq, mockRes);

      expect(deleteIndicateur).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('devrait retourner 400 si la suppression échoue', async () => {
      const error = new Error('Échec de la suppression');
      deleteIndicateur.mockRejectedValue(error);

      await supprimer(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Échec de la suppression' });
    });
  });
});