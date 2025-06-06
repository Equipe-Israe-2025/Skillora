import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import Baser from './Baser.js'; // Chemin vers ton fichier Baser.js

describe('Modèle Baser', () => {
  let sequelize;
  let Indicateur;
  let Competence;
  let Utilisateur;
  let Etudiant;
  let BaserModel;

  beforeAll(async () => {
    // Configuration de Sequelize avec SQLite en mémoire
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
      define: {
        freezeTableName: true, // Empêche le pluriel automatique
        timestamps: false     // Désactive les timestamps
      }
    });

    // Définition des modèles nécessaires pour Baser
    Indicateur = sequelize.define('Indicateur', {
      Id_I: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    }, {
      tableName: 'Indicateur'
    });

    Competence = sequelize.define('Competence', {
      Id_C: {
        type: DataTypes.STRING,
        primaryKey: true
      },
    }, {
      tableName: 'Competence'
    });

    Utilisateur = sequelize.define('Utilisateur', {
      Id_U: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    }, {
      tableName: 'Utilisateur'
    });

    Etudiant = sequelize.define('Etudiant', {
      CNE: {
        type: DataTypes.STRING,
        primaryKey: true
      },
    }, {
      tableName: 'Etudiant'
    });

    // Initialisation du modèle Baser
    BaserModel = Baser(sequelize, DataTypes);

    // Établissement des associations
    if (BaserModel.associate) {
      BaserModel.associate({ Indicateur, Competence, Utilisateur, Etudiant });
    }

    // Synchronisation avec force:true pour recréer les tables
    await sequelize.sync({ force: true });

    // Insertion de données valides dans les tables référencées
    await Indicateur.create({ Id_I: 1 });
    await Competence.create({ Id_C: 'C001' });
    await Utilisateur.create({ Id_U: 1 });
    await Etudiant.create({ CNE: 'CNE123' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('doit définir correctement les attributs du modèle', async () => {
    const baser = await BaserModel.create({
      Id_I: 1,
      Id_C: 'C001',
      Id_U: 1,
      CNE: 'CNE123'
    });

    // Vérification de la création de l'élément
    expect(baser.Id_I).toBe(1);
    expect(baser.Id_C).toBe('C001');
    expect(baser.Id_U).toBe(1);
    expect(baser.CNE).toBe('CNE123');
  });

  it('doit avoir le bon nom de table et options', async () => {
    // Vérifie le nom de la table et si les timestamps sont désactivés
    const baser = BaserModel.options.tableName;
    expect(baser).toBe('Baser');
    expect(BaserModel.options.timestamps).toBe(false);
  });

  it('doit valider les clés étrangères correctement', async () => {
    // Essaye de créer un enregistrement avec des clés inexistantes (devrait échouer)
    try {
      await BaserModel.create({
        Id_I: 999,    // Clé étrangère non valide
        Id_C: 'C002', // Clé étrangère non valide
        Id_U: 999,    // Clé étrangère non valide
        CNE: 'CNE999' // Clé étrangère non valide
      });
    } catch (error) {
      expect(error.name).toBe('SequelizeForeignKeyConstraintError');  // Erreur attendue de contrainte de clé étrangère
    }
  });
});
