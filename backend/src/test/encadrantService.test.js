// encadrantService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as services from './encadrantService.js';
import { Encadrant, Utilisateur, Forme, Groupe, Etudiant, Filiere } from '../sync.js';
import Sequelize from 'sequelize';

vi.mock('../sync.js', () => ({
  Encadrant: { findOne: vi.fn() },
  Utilisateur: {},
  Forme: { findAll: vi.fn(), bulkCreate: vi.fn(), destroy: vi.fn() },
  Groupe: { create: vi.fn(), update: vi.fn() },
  Etudiant: { findAll: vi.fn() },
  Filiere: { findOne: vi.fn() },
  Enseigne: { findAll: vi.fn() },
}));

const { Op } = Sequelize;

describe('encadrantService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProfilEncadrant - trouvé', async () => {
    Encadrant.findOne.mockResolvedValue({
      Id_U: 1,
      utilisateur: {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@example.com',
        role: 'Encadrant'
      }
    });

    const result = await services.getProfilEncadrant(1);
    expect(result.utilisateur.nom).toBe('Dupont');
  });

  it('getProfilEncadrant - non trouvé', async () => {
    Encadrant.findOne.mockResolvedValue(null);
    await expect(services.getProfilEncadrant(2)).rejects.toThrow('Encadrant non trouvé');
  });

  it('createGroupeAvecEtudiants', async () => {
    Groupe.create.mockResolvedValue({ Id_G: 42 });
    Forme.bulkCreate.mockResolvedValue(true);

    await services.createGroupeAvecEtudiants('SUM123', 'Groupe A', ['CNE1', 'CNE2']);
    expect(Groupe.create).toHaveBeenCalled();
    expect(Forme.bulkCreate).toHaveBeenCalledWith([
      { Num_sum: 'SUM123', Id_G: 42, CNE: 'CNE1' },
      { Num_sum: 'SUM123', Id_G: 42, CNE: 'CNE2' }
    ]);
  });

  it('modifierNomGroupe', async () => {
    Groupe.update.mockResolvedValue([1]);
    const result = await services.modifierNomGroupe(42, 'Nouveau Nom');
    expect(Groupe.update).toHaveBeenCalledWith(
      { NomProjet: 'Nouveau Nom' },
      { where: { Id_G: 42 } }
    );
    expect(result).toEqual([1]);
  });

  it('supprimerEtudiantsDuGroupe', async () => {
    Forme.destroy.mockResolvedValue(2);
    const result = await services.supprimerEtudiantsDuGroupe(5, ['CNE1', 'CNE2']);
    expect(Forme.destroy).toHaveBeenCalledWith({
      where: {
        Id_G: 5,
        CNE: ['CNE1', 'CNE2']
      }
    });
    expect(result).toBe(2);
  });

  it('ajouterEtudiantsAuGroupe', async () => {
    Forme.bulkCreate.mockResolvedValue(true);
    await services.ajouterEtudiantsAuGroupe(10, ['CNE1', 'CNE2'], 'SUM456');
    expect(Forme.bulkCreate).toHaveBeenCalledWith([
      { Num_Somme: 'SUM456', Id_G: 10, CNE: 'CNE1' },
      { Num_Somme: 'SUM456', Id_G: 10, CNE: 'CNE2' }
    ]);
  });

  it('getEtudiantsDansGroupe', async () => {
    Forme.findAll.mockResolvedValue([{ CNE: 'CNE1' }, { CNE: 'CNE2' }]);
    const result = await services.getEtudiantsDansGroupe(8);
    expect(Forme.findAll).toHaveBeenCalledWith({
      where: { Id_G: 8 },
      include: [{ model: Etudiant }]
    });
    expect(result.length).toBe(2);
  });

  it('getEtudiantsHorsGroupe', async () => {
    Forme.findAll.mockResolvedValue([{ CNE: 'CNE1' }]);
    Etudiant.findAll.mockResolvedValue([{ CNE: 'CNE2' }]);

    const result = await services.getEtudiantsHorsGroupe(1, 2);
    expect(Etudiant.findAll).toHaveBeenCalledWith({
      where: {
        Filiere: 2,
        CNE: {
          [Op.notIn]: ['CNE1']
        }
      }
    });
    expect(result).toEqual([{ CNE: 'CNE2' }]);
  });

  // it('getFilieresByEncadrant', async () => {
  //   const mockEnseignes = [
  //     { filiere: { Id_F: 1, nom_filiere: 'Informatique' } },
  //     { filiere: { Id_F: 2, nom_filiere: 'Génie Civil' } },
  //   ];
  //   const Enseigne = (await import('../sync.js')).Enseigne;
  //   Enseigne.findAll.mockResolvedValue(mockEnseignes);

  //   const result = await services.getFilieresByEncadrant('SUM001');
  //   expect(result).toEqual([
  //     { Id_F: 1, nom_filiere: 'Informatique' },
  //     { Id_F: 2, nom_filiere: 'Génie Civil' }
  //   ]);
  // });  

  it('getEtudiantsByFiliere', async () => {
    Etudiant.findAll.mockResolvedValue([
      { utilisateur: { nom: 'Ali', prenom: 'Yassine' } },
      { utilisateur: { nom: 'Sara', prenom: 'Amine' } }
    ]);

    const result = await services.getEtudiantsByFiliere(3);
    expect(Etudiant.findAll).toHaveBeenCalledWith({
      where: { Id_F: 3 },
      include: [
        {
          association: 'utilisateur',
          attributes: ['nom', 'prenom', 'email', 'image']
        }
      ]
    });
    expect(result.length).toBe(2);
  });

  it('getFiliereInfo', async () => {
    Filiere.findOne.mockResolvedValue({
      Id_F: 3,
      nom_filiere: 'Mathématiques',
      nbr_Etud: 45
    });

    const result = await services.getFiliereInfo(3);
    expect(Filiere.findOne).toHaveBeenCalledWith({
      where: { Id_F: 3 },
      attributes: [
        'Id_F',
        'nom_filiere',
        'nbr_Etud',
        'Volume_horaire',
        'chef_filiere',
        'description'
      ]
    });
    expect(result.nbr_Etud).toBe(45);
  });

  it('getGroupesByEncadrant', async () => {
    Forme.findAll.mockResolvedValue([
      {
        Id_G: 1,
        groupe: { Id_G: 1, NomProjet: 'Projet 1' },
        etudiant: { CNE: 'CNE1', utilisateur: { nom: 'Amina' } }
      },
      {
        Id_G: 1,
        groupe: { Id_G: 1, NomProjet: 'Projet 1' },
        etudiant: { CNE: 'CNE2', utilisateur: { nom: 'Omar' } }
      }
    ]);

    const result = await services.getGroupesByEncadrant('SUM999');
    expect(result).toEqual([
      {
        groupe: { Id_G: 1, NomProjet: 'Projet 1' },
        etudiants: [
          { CNE: 'CNE1', utilisateur: { nom: 'Amina' } },
          { CNE: 'CNE2', utilisateur: { nom: 'Omar' } }
        ]
      }
    ]);
  });
});



