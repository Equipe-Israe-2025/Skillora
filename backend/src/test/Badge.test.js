import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import Baser from './Baser.js';

describe('Modèle Baser', () => {
  let sequelize;
  let Indicateur;
  let Competence;
  let Utilisateur;
  let Etudiant;
  let BaserModel;

  beforeAll(async () => {
    // Initialiser la base SQLite en mémoire
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
      define: {
        freezeTableName: true,
        timestamps: false
      }
    });

    // Définir les modèles associés
    Indicateur = sequelize.define('Indicateur', {
      Id_I: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nom_I: DataTypes.STRING
    });

    Competence = sequelize.define('Competence', {
      Id_C: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      nom_C: DataTypes.STRING
    });

    Utilisateur = sequelize.define('Utilisateur', {
      Id_U: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nom: DataTypes.STRING
    });

    Etudiant = sequelize.define('Etudiant', {
      CNE: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      nom: DataTypes.STRING
    });

    // Initialiser Baser
    BaserModel = Baser(sequelize, DataTypes);

    // Configurer les associations
    if (BaserModel.associate) {
      BaserModel.associate({ Indicateur, Competence, Utilisateur, Etudiant });
    }

    // Synchroniser les tables
    await sequelize.sync({ force: true });

    // Insérer des données initiales
    await Indicateur.create({ Id_I: 1, nom_I: 'Indicateur 1' });
    await Competence.create({ Id_C: 'COMP1', nom_C: 'Compétence 1' });
    await Utilisateur.create({ Id_U: 1, nom: 'Utilisateur 1' });
    await Etudiant.create({ CNE: 'E123', nom: 'Étudiant 1' });

    await Etudiant.create({ CNE: 'E124', nom: 'Étudiant 2' }); // 2ème étudiant pour éviter collisions
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('doit créer un enregistrement Baser valide', async () => {
    const baser = await BaserModel.create({
      Id_I: 1,
      Id_C: 'COMP1',
      Id_U: 1,
      CNE: 'E123'
    });

    expect(baser.Id_I).toBe(1);
    expect(baser.Id_C).toBe('COMP1');
    expect(baser.Id_U).toBe(1);
    expect(baser.CNE).toBe('E123');
  });

  it('doit avoir les associations correctes', async () => {
    const baser = await BaserModel.create({
      Id_I: 1,
      Id_C: 'COMP1',
      Id_U: 1,
      CNE: 'E124' // autre étudiant pour éviter conflit
    });

    const baserWithAssociations = await BaserModel.findOne({
      where: {
        Id_I: 1,
        Id_C: 'COMP1',
        Id_U: 1,
        CNE: 'E124'
      },
      include: [
        { model: Indicateur, as: 'indicateur' },
        { model: Competence, as: 'competence' },
        { model: Utilisateur, as: 'utilisateur' },
        { model: Etudiant, as: 'etudiant' }
      ]
    });

    expect(baserWithAssociations.indicateur).not.toBeNull();
    expect(baserWithAssociations.competence).not.toBeNull();
    expect(baserWithAssociations.utilisateur).not.toBeNull();
    expect(baserWithAssociations.etudiant).not.toBeNull();
  });

  it('doit échouer si une clé étrangère est manquante', async () => {
    await expect(
      BaserModel.create({
        Id_I: 999, // Indicateur qui n'existe pas
        Id_C: 'COMP1',
        Id_U: 1,
        CNE: 'E123'
      })
    ).rejects.toThrow();
  });

  it('doit échouer si une partie de la clé primaire est manquante', async () => {
    await expect(
      BaserModel.create({
        Id_C: 'COMP1',
        Id_U: 1,
        CNE: 'E123'
        // Id_I manquant
      })
    ).rejects.toThrow();
  });

  it('doit accepter plusieurs enregistrements avec différentes combinaisons de clés', async () => {
    await Indicateur.create({ Id_I: 2, nom_I: 'Indicateur 2' });

    const baser1 = await BaserModel.create({
      Id_I: 1,
      Id_C: 'COMP1',
      Id_U: 1,
      CNE: 'E123'
    });

    const baser2 = await BaserModel.create({
      Id_I: 2,
      Id_C: 'COMP1',
      Id_U: 1,
      CNE: 'E124' // autre étudiant = pas de collision
    });

    expect(baser1.Id_I).not.toBe(baser2.Id_I);
    expect(baser1.CNE).not.toBe(baser2.CNE);
    expect(baser1.Id_C).toBe(baser2.Id_C);
  });
});
