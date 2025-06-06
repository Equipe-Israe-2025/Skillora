import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  afficherProfilEtudiant,
  afficherMesGroupes,
  afficherDetailsGroupe
} from './etudiantController.js';

import * as etudiantService from '../services/etudiantService.js';

vi.mock('../../src/services/etudiantService.js', () => ({
  getProfilEtudiant: vi.fn(),
  getMesGroupes: vi.fn(),
  getDetailsGroupe: vi.fn()
}));

describe('Etudiant Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { Id_U: 1 },
      params: {}
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    vi.clearAllMocks();
  });

  // ✅ afficherProfilEtudiant
  describe('afficherProfilEtudiant', () => {
    it('devrait retourner le profil si trouvé', async () => {
      const mockEtudiant = { nom: 'Test', prenom: 'Etudiant' };
      etudiantService.getProfilEtudiant.mockResolvedValue(mockEtudiant);

      await afficherProfilEtudiant(req, res);

      expect(etudiantService.getProfilEtudiant).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEtudiant);
    });

    it('devrait retourner 404 si aucun étudiant', async () => {
      etudiantService.getProfilEtudiant.mockResolvedValue(null);

      await afficherProfilEtudiant(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Profil étudiant non trouvé.' });
    });

    it('devrait gérer une erreur serveur', async () => {
      etudiantService.getProfilEtudiant.mockRejectedValue(new Error('Erreur'));

      await afficherProfilEtudiant(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur.' });
    });
  });

  // ✅ afficherMesGroupes
  describe('afficherMesGroupes', () => {
    it('devrait retourner les groupes', async () => {
      const groupesMock = [{ id: 1, nom: 'G1' }];
      etudiantService.getMesGroupes.mockResolvedValue(groupesMock);

      await afficherMesGroupes(req, res);

      expect(etudiantService.getMesGroupes).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(groupesMock);
    });

    it('devrait gérer une erreur serveur', async () => {
      etudiantService.getMesGroupes.mockRejectedValue(new Error('Erreur'));

      await afficherMesGroupes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur.' });
    });
  });

  // ✅ afficherDetailsGroupe
  describe('afficherDetailsGroupe', () => {
    it('devrait retourner les détails du groupe', async () => {
      req.params.groupeId = '123';
      const detailsMock = { encadrant: {}, etudiants: [] };
      etudiantService.getDetailsGroupe.mockResolvedValue(detailsMock);

      await afficherDetailsGroupe(req, res);

      expect(etudiantService.getDetailsGroupe).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(detailsMock);
    });

    it('devrait retourner 404 si groupe introuvable', async () => {
      req.params.groupeId = '456';
      etudiantService.getDetailsGroupe.mockResolvedValue(null);

      await afficherDetailsGroupe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Groupe non trouvé.' });
    });

    it('devrait gérer une erreur serveur', async () => {
      req.params.groupeId = '999';
      etudiantService.getDetailsGroupe.mockRejectedValue(new Error('Erreur'));

      await afficherDetailsGroupe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur.' });
    });
  });
});
