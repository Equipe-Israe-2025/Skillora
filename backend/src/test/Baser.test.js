import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
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
    // Configuration de la base de données en mémoire
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
      define: {
        freezeTableName: true,
        timestamps: false
      }
    });

    // Définition des modèles associés
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

    // Initialisation du modèle Baser
    BaserModel = Baser(sequelize, DataTypes);

    // Établissement des associations
    if (BaserModel.associate) {
      BaserModel.associate({ Indicateur, Competence, Utilisateur, Etudiant });
    }

    // Synchronisation des modèles
    await sequelize.sync({ force: true });

    // Données de base
    await Indicateur.bulkCreate([
      { Id_I: 1, nom_I: 'Indicateur Test' },
      { Id_I: 2, nom_I: 'Indicateur 2' }
    ]);
    await Competence.create({ Id_C: 'COMP1', nom_C: 'Compétence Test' });
    await Utilisateur.create({ Id_U: 1, nom: 'Utilisateur Test' });
    await Etudiant.bulkCreate([
      { CNE: 'E123', nom: 'Étudiant Test 1' },
      { CNE: 'E124', nom: 'Étudiant Test 2' }
    ]);
  });

  beforeEach(async () => {
    // Nettoyer la table Baser avant chaque test
    await BaserModel.destroy({ where: {} });
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
    await BaserModel.create({
      Id_I: 1,
      Id_C: 'COMP1',
      Id_U: 1,
      CNE: 'E123'
    });

    const baserWithAssociations = await BaserModel.findOne({
      where: { Id_I: 1, Id_C: 'COMP1', Id_U: 1, CNE: 'E123' },
      include: [
        { model: Indicateur, as: 'indicateur' },
        { model: Competence, as: 'competence' },
        { model: Utilisateur, as: 'utilisateur' },
        { model: Etudiant, as: 'etudiant' }
      ]
    });

    expect(baserWithAssociations.indicateur.Id_I).toBe(1);
    expect(baserWithAssociations.competence.Id_C).toBe('COMP1');
    expect(baserWithAssociations.utilisateur.Id_U).toBe(1);
    expect(baserWithAssociations.etudiant.CNE).toBe('E123');
  });

  it('doit échouer si une clé étrangère est manquante', async () => {
    await expect(
      BaserModel.create({
        Id_I: 999, // Id_I inexistant
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
        // Id_I est manquant
      })
    ).rejects.toThrow();
  });

  it('doit accepter plusieurs enregistrements avec différentes combinaisons de clés', async () => {
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
      CNE: 'E124'
    });

    expect(baser1.Id_I).not.toBe(baser2.Id_I);
    expect(baser1.CNE).not.toBe(baser2.CNE);
    expect(baser1.Id_C).toBe(baser2.Id_C);
  });
});
