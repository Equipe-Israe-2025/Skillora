import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Sequelize, DataTypes, ValidationError } from 'sequelize';
import FiliereModel from './Filiere';

describe('Filiere Model', () => {
  let sequelize;
  let Filiere;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    Filiere = FiliereModel(sequelize, DataTypes);
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Filiere.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer une filière valide', async () => {
    const filiere = await Filiere.create({
      Id_F: 'INFO',
      nbr_Etud: 120,
      Volume_horaire: 400,
      chef_filiere: 'Mme Dupont',
      description: 'Informatique générale',
      nom_filiere: 'Informatique'
    });

    expect(filiere.Id_F).toBe('INFO');
    expect(filiere.nom_filiere).toBe('Informatique');
  });

  it('devrait rejeter si Id_F est vide', async () => {
    await expect(Filiere.create({
      Id_F: '',
      nom_filiere: 'Génie électrique'
    })).rejects.toThrow(ValidationError);
  });

  it('devrait rejeter si nom_filiere est vide', async () => {
    await expect(Filiere.create({
      Id_F: 'GELEC',
      nom_filiere: ''
    })).rejects.toThrow(ValidationError);
  });

  it('devrait rejeter si nom_filiere est trop court', async () => {
    await expect(Filiere.create({
      Id_F: 'GELEC',
      nom_filiere: 'A'
    })).rejects.toThrow(ValidationError);
  });
});