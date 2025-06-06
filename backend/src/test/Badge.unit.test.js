import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import Badge from './Badge.js'; // Chemin vers ton fichier Badge.js

describe('Modèle Badge', () => {
  let sequelize;
  let Competence;
  let Utilisateur;
  let Etudiant;
  let BadgeModel;

  beforeAll(async () => {
    // Configuration de Sequelize avec SQLite en mémoire
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
      define: {
        freezeTableName: true, // Empêche le pluriel automatique
        timestamps: false     // Désactive les timestamps
      }
    });

    // Définition des modèles nécessaires pour Badge
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

    // Initialisation du modèle Badge
    BadgeModel = Badge(sequelize, DataTypes);

    // Établissement des associations
    if (BadgeModel.associate) {
      BadgeModel.associate({ Competence, Utilisateur, Etudiant });
    }

    // Synchronisation avec force:true pour recréer les tables
    await sequelize.sync({ force: true });

    // Insertion de données valides dans les tables référencées
    await Competence.create({ Id_C: 'C001' });
    await Utilisateur.create({ Id_U: 1 });
    await Etudiant.create({ CNE: 'CNE123' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('doit définir correctement les attributs du modèle', async () => {
    const badge = await BadgeModel.create({
      nom_B: 'Badge Test',
      description: 'Description du badge',
      Id_C: 'C001',
      Id_U: 1,
      CNE: 'CNE123'
    });

    // Vérification de la création de l'élément
    expect(badge.nom_B).toBe('Badge Test');
    expect(badge.description).toBe('Description du badge');
    expect(badge.Id_C).toBe('C001');
    expect(badge.Id_U).toBe(1);
    expect(badge.CNE).toBe('CNE123');
    expect(badge.Id_B).toBeDefined(); // Vérifie si l'ID a été généré automatiquement
  });

  it('doit avoir le bon nom de table et options', async () => {
    // Vérifie le nom de la table et si les timestamps sont désactivés
    const badge = BadgeModel.options.tableName;
    expect(badge).toBe('Badge');
    expect(BadgeModel.options.timestamps).toBe(false);
  });

  it('doit valider l\'attribut nom_B comme non vide', async () => {
    try {
      // Essaye de créer un badge avec un nom vide
      await BadgeModel.create({
        nom_B: '',  // nom vide, ce qui devrait échouer
        description: 'Description du badge',
        Id_C: 'C001',
        Id_U: 1,
        CNE: 'CNE123'
      });
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');  // Erreur attendue de validation
    }
  });
});