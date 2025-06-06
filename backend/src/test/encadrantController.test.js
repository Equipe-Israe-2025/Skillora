import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getMonProfil,
  getFilieres,
  getFiliereEtudiants,
  getFiliereInformations,
  getGroupesAvecEtudiants,
  creerGroupeAvecEtudiants,
  modifierNom,
  supprimerEtudiants,
  ajouterEtudiants,
  afficherEtudiantsDansGroupe,
  afficherEtudiantsHorsGroupe
} from './encadrantController.js';


// Mock des services
vi.mock('../services/encadrantService.js', () => ({
  getProfilEncadrant: vi.fn(),
  getFilieresByEncadrant: vi.fn(),
  getEtudiantsByFiliere: vi.fn(),
  getFiliereInfo: vi.fn(),
  getGroupesByEncadrant: vi.fn(),
  createGroupeAvecEtudiants: vi.fn(),
  modifierNomGroupe: vi.fn(),
  supprimerEtudiantsDuGroupe: vi.fn(),
  ajouterEtudiantsAuGroupe: vi.fn(),
  getEtudiantsDansGroupe: vi.fn(),
  getEtudiantsHorsGroupe: vi.fn()
}));
//mocker groupeService.js 
vi.mock('../services/groupeService.js', () => ({
    modifierNomGroupe: vi.fn(),
    supprimerEtudiantsDuGroupe: vi.fn(),
    ajouterEtudiantsAuGroupe: vi.fn(),
    getEtudiantsDansGroupe: vi.fn(),
    getEtudiantsHorsGroupe: vi.fn()
  }));
 

import * as groupeService from '../services/groupeService.js';
import * as encadrantService from '../services/encadrantService.js';

describe('Encadrant Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        Id_U: 1,
        role: 'encadrant',
        numSum: 'ENC123',
        encadrant: { Num_sum: 'ENC123' }
      },
      params: {},
      body: {}
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  describe('getMonProfil', () => {
    it('devrait retourner le profil de l\'encadrant', async () => {
      const mockProfil = { nom: 'Dupont', prenom: 'Jean' };
      encadrantService.getProfilEncadrant.mockResolvedValue(mockProfil);

      await getMonProfil(req, res);

      expect(encadrantService.getProfilEncadrant).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockProfil);
    });

    it('devrait retourner une erreur 404 si le profil n\'est pas trouvé', async () => {
      encadrantService.getProfilEncadrant.mockRejectedValue(new Error('Profil non trouvé'));

      await getMonProfil(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Profil non trouvé' });
    });
  });

  describe('getFilieres', () => {
    it('devrait retourner les filières de l\'encadrant', async () => {
      const mockFilieres = [{ id: 1, nom: 'Informatique' }];
      encadrantService.getFilieresByEncadrant.mockResolvedValue(mockFilieres);

      await getFilieres(req, res);

      expect(encadrantService.getFilieresByEncadrant).toHaveBeenCalledWith('ENC123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFilieres);
    });

    it('devrait retourner une erreur 500 en cas de problème serveur', async () => {
      encadrantService.getFilieresByEncadrant.mockRejectedValue(new Error('Erreur serveur'));

      await getFilieres(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur lors de la récupération des filières.' });
    });
  });

  describe('getFiliereEtudiants', () => {
    it('devrait retourner les étudiants d\'une filière', async () => {
      req.params.idFiliere = '1';
      const mockEtudiants = [{ cne: 'E123', nom: 'Martin' }];
      encadrantService.getEtudiantsByFiliere.mockResolvedValue(mockEtudiants);

      await getFiliereEtudiants(req, res);

      expect(encadrantService.getEtudiantsByFiliere).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockEtudiants);
    });

    it('devrait retourner une erreur 500 en cas d\'erreur', async () => {
      req.params.idFiliere = '1';
      encadrantService.getEtudiantsByFiliere.mockRejectedValue(new Error('Erreur'));

      await getFiliereEtudiants(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getFiliereInformations', () => {
    it('devrait retourner les informations d\'une filière', async () => {
      req.params.idFiliere = '1';
      const mockFiliere = { id: 1, nom: 'Informatique' };
      encadrantService.getFiliereInfo.mockResolvedValue(mockFiliere);

      await getFiliereInformations(req, res);

      expect(encadrantService.getFiliereInfo).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockFiliere);
    });

    it('devrait retourner 404 si la filière n\'existe pas', async () => {
      req.params.idFiliere = '999';
      encadrantService.getFiliereInfo.mockResolvedValue(null);

      await getFiliereInformations(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getGroupesAvecEtudiants', () => {
    it('devrait retourner les groupes de l\'encadrant', async () => {
      const mockGroupes = [{ id: 1, nom: 'Groupe A' }];
      encadrantService.getGroupesByEncadrant.mockResolvedValue(mockGroupes);

      await getGroupesAvecEtudiants(req, res);

      expect(encadrantService.getGroupesByEncadrant).toHaveBeenCalledWith('ENC123');
      expect(res.json).toHaveBeenCalledWith(mockGroupes);
    });

    it('devrait retourner 403 si l\'utilisateur n\'est pas encadrant', async () => {
      req.user.encadrant = null;

      await getGroupesAvecEtudiants(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('creerGroupeAvecEtudiants', () => {
    it('devrait créer un groupe avec des étudiants', async () => {
      req.body = { idGroupe: 1, cneList: ['E123', 'E456'] };

      await creerGroupeAvecEtudiants(req, res);

      expect(encadrantService.createGroupeAvecEtudiants).toHaveBeenCalledWith('ENC123', 1, ['E123', 'E456']);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('devrait retourner 400 si les données sont incomplètes', async () => {
      req.body = { idGroupe: 1 };

      await creerGroupeAvecEtudiants(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
// Tests pour les autres fonctions (modifierNom, supprimerEtudiants, etc.)
//   suivraient le même pattern...
});

