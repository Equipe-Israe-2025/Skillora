import { describe, it, expect, vi } from 'vitest';
import { getProfilEtudiant, getMesGroupes, getDetailsGroupe } from '../services/etudiantService';
import { Etudiant, Utilisateur, Filiere, Forme, Groupe, Encadrant } from '../sync.js';

// Mock des modèles
vi.mock('../sync.js', () => ({
  Etudiant: {
    findOne: vi.fn()
  },
  Forme: {
    findAll: vi.fn()
  },
  Groupe: {},
  Encadrant: {},
  Filiere: {},
  Utilisateur: {}
}));

describe('etudiantService', () => {
  describe('getProfilEtudiant', () => {
    it('devrait retourner un étudiant avec les informations de l\'utilisateur et de la filière', async () => {
      const fakeUtilisateur = { nom: 'Doe', prenom: 'John', email: 'john.doe@example.com', image: 'image_url', role: 'etudiant', taux: 85 };
      const fakeFiliere = { Id_F: 1, nom_filiere: 'Informatique', nbr_Etud: 50, Volume_horaire: 30, chef_filiere: 'Dr. Smith', description: 'Filière d\'informatique' };
      const fakeEtudiant = {
        Id_U: 1,
        Id_F: 1,
        utilisateur: fakeUtilisateur,
        filiere: fakeFiliere
      };

      Etudiant.findOne.mockResolvedValue(fakeEtudiant);

      const result = await getProfilEtudiant(1);

      expect(result).toBeDefined();
      expect(result.Id_U).toBe(1);
      expect(result.utilisateur.nom).toBe('Doe');
      expect(result.filiere.nom_filiere).toBe('Informatique');
    });

    it('devrait lancer une erreur si l\'étudiant n\'est pas trouvé', async () => {
      Etudiant.findOne.mockResolvedValue(null);

      await expect(getProfilEtudiant(1)).rejects.toThrow('Etudiant non trouvé');
    });
  });

  describe('getMesGroupes', () => {
    it('devrait retourner les groupes d\'un étudiant', async () => {
      const fakeEtudiant = { CNE: '12345' };
      const fakeGroupe = { Id_G: 1, nom_Groupe: 'Groupe A' };
      const fakeForme = {
        CNE: '12345',
        groupe: fakeGroupe
      };

      Etudiant.findOne.mockResolvedValue(fakeEtudiant);
      Forme.findAll.mockResolvedValue([fakeForme]);

      const result = await getMesGroupes(1);

      expect(result).toHaveLength(1);
      expect(result[0].nom_Groupe).toBe('Groupe A');
    });

    it('devrait lancer une erreur si l\'étudiant n\'est pas trouvé', async () => {
      Etudiant.findOne.mockResolvedValue(null);

      await expect(getMesGroupes(1)).rejects.toThrow('Etudiant non trouvé');
    });
  });

  describe('getDetailsGroupe', () => {
    it('devrait retourner les détails d\'un groupe', async () => {
      const fakeEncadrant = {
        utilisateur: { nom: 'Smith', prenom: 'John' }
      };
      const fakeEtudiant = { utilisateur: { nom: 'Doe', prenom: 'Jane' } };
      const fakeForme = {
        encadrant: fakeEncadrant,
        etudiant: fakeEtudiant
      };
      const fakeGroupe = { Id_G: 1, nom_Groupe: 'Groupe A' };

      Forme.findAll.mockResolvedValue([fakeForme]);

      const result = await getDetailsGroupe(1);

      expect(result).toBeDefined();
      expect(result.encadrant.utilisateur.nom).toBe('Smith');
      expect(result.etudiants[0].utilisateur.nom).toBe('Doe');
    });

    it('devrait retourner null si aucun forme n\'est trouvé', async () => {
      Forme.findAll.mockResolvedValue([]);

      const result = await getDetailsGroupe(1);

      expect(result).toBeNull();
    });
  });
});