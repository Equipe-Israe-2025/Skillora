import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import FormeModel from './Forme';

describe('Forme Model', () => {
  let sequelize;
  let Forme, Encadrant, Groupe, Etudiant;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });

    // Définir les modèles liés
    Encadrant = sequelize.define('Encadrant', {
      Num_sum: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      nom: DataTypes.STRING
    }, { tableName: 'Encadrant', timestamps: false });

    Groupe = sequelize.define('Groupe', {
      Id_G: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      nom_groupe: DataTypes.STRING
    }, { tableName: 'Groupe', timestamps: false });

    Etudiant = sequelize.define('Etudiant', {
      CNE: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      nom: DataTypes.STRING
    }, { tableName: 'Etudiant', timestamps: false });

    // Initialiser Forme avec associations
    Forme = FormeModel(sequelize, DataTypes);

    if (Forme.associate) {
      Forme.associate({ Encadrant, Groupe, Etudiant });
    }

    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Forme.destroy({ where: {}, truncate: true });
    await Etudiant.destroy({ where: {}, truncate: true });
    await Groupe.destroy({ where: {}, truncate: true });
    await Encadrant.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer une entrée Forme avec relations valides', async () => {
    const encadrant = await Encadrant.create({ Num_sum: 'E001', nom: 'Mme Karim' });
    const groupe = await Groupe.create({ Id_G: 1, nom_groupe: 'G1' });
    const etudiant = await Etudiant.create({ CNE: 'C123', nom: 'Fatima' });

    const forme = await Forme.create({
      Num_sum: encadrant.Num_sum,
      Id_G: groupe.Id_G,
      CNE: etudiant.CNE
    });

    expect(forme.Num_sum).toBe('E001');
    expect(forme.Id_G).toBe(1);
    expect(forme.CNE).toBe('C123');
  });

  it('devrait rejeter la création sans clé étrangère valide', async () => {
    // Aucun encadrant/étudiant/groupe créé
    await expect(Forme.create({
      Num_sum: 'INVALID',
      Id_G: 999,
      CNE: 'FAKE123'
    })).rejects.toThrow();
  });
});