import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Sequelize, DataTypes, ValidationError, UniqueConstraintError } from 'sequelize';
import GroupeModel from './Groupe';

describe('Groupe Model', () => {
  let sequelize;
  let Groupe;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    Groupe = GroupeModel(sequelize, DataTypes);
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Groupe.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer un groupe valide', async () => {
    const groupe = await Groupe.create({
      nom_groupe: 'G1',
      Annee: 2025
    });

    expect(groupe.nom_groupe).toBe('G1');
    expect(groupe.Annee).toBe(2025);
    expect(groupe.Id_G).toBeDefined();
  });

  it('devrait rejeter si nom_groupe est vide', async () => {
    await expect(Groupe.create({
      nom_groupe: '',
      Annee: 2025
    })).rejects.toThrow(ValidationError);
  });

  it('devrait rejeter si Annee est inférieure à 2000', async () => {
    await expect(Groupe.create({
      nom_groupe: 'G2',
      Annee: 1999
    })).rejects.toThrow(ValidationError);
  });

  it('devrait rejeter si Annee est supérieure à l’année actuelle + 5', async () => {
    const anneeFuture = new Date().getFullYear() + 6;

    await expect(Groupe.create({
      nom_groupe: 'G3',
      Annee: anneeFuture
    })).rejects.toThrow(ValidationError);
  });

  it('devrait rejeter les doublons sur (nom_groupe, Annee)', async () => {
    await Groupe.create({ nom_groupe: 'G4', Annee: 2024 });

    await expect(Groupe.create({
      nom_groupe: 'G4',
      Annee: 2024
    })).rejects.toThrow(UniqueConstraintError);
  });
});