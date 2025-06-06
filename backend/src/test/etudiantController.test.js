import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  afficherProfilEtudiant,
  afficherMesGroupes,
  afficherDetailsGroupe
} from './etudiantController.js';

// Mock des services appelés par le contrôleur
import * as etudiantService from '../services/etudiantService.js';

vi.mock('../services/etudiantService.js', () => ({
  getProfilEtudiant: vi.fn(),
  getMesGroupes: vi.fn(),
  getDetailsGroupe: vi.fn(),
}));

describe('etudiantController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { Id_U: 1 },
      params: { groupeId: 1 },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  describe('afficherProfilEtudiant', () => {
    it('devrait retourner le profil étudiant avec succès', async () => {
      const etudiant = { nom: 'Test', prenom: 'Etudiant' };
      etudiantService.getProfilEtudiant.mockResolvedValue(etudiant);

      await afficherProfilEtudiant(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(etudiant);
    });

    it("devrait retourner 404 si l'étudiant n'est pas trouvé", async () => {
      etudiantService.getProfilEtudiant.mockResolvedValue(null);

      await afficherProfilEtudiant(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Profil étudiant non trouvé.' });
    });

    it('devrait retourner une erreur serveur si une exception est levée', async () => {
      etudiantService.getProfilEtudiant.mockRejectedValue(new Error('Erreur'));

      await afficherProfilEtudiant(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur.' });
    });
  });

  describe('afficherMesGroupes', () => {
    it('devrait retourner les groupes de l\'étudiant', async () => {
      const groupes = [{ Id_G: 1, nom: 'Groupe A' }];
      etudiantService.getMesGroupes.mockResolvedValue(groupes);

      await afficherMesGroupes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(groupes);
    });

    it('devrait gérer une erreur serveur', async () => {
      etudiantService.getMesGroupes.mockRejectedValue(new Error('Erreur'));

      await afficherMesGroupes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur.' });
    });
  });

  describe('afficherDetailsGroupe', () => {
    it('devrait retourner les détails du groupe', async () => {
      const details = { Id_G: 1, nom: 'Groupe A' };
      etudiantService.getDetailsGroupe.mockResolvedValue(details);

      await afficherDetailsGroupe(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(details);
    });

    it('devrait retourner 404 si le groupe est introuvable', async () => {
      etudiantService.getDetailsGroupe.mockResolvedValue(null);

      await afficherDetailsGroupe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Groupe non trouvé.' });
    });

    it('devrait gérer une erreur serveur', async () => {
      etudiantService.getDetailsGroupe.mockRejectedValue(new Error('Erreur'));

      await afficherDetailsGroupe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur.' });
    });
  });
});
