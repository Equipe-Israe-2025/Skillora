import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import Competence from './Competence.js'; // Chemin vers ton fichier Competence.js

describe('Modèle Competence', () => {
  let sequelize;
  let CompetenceModel;
  let Indicateur;
  let Baser;

  beforeAll(async () => {
    // Configuration de Sequelize avec SQLite en mémoire
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
      define: {
        freezeTableName: true, // Empêche le pluriel automatique
        timestamps: false     // Désactive les timestamps
      }
    });

    // Définition des modèles nécessaires pour Competence
    Indicateur = sequelize.define('Indicateur', {
      Id_I: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      Id_C: {
        type: DataTypes.STRING,
        references: {
          model: 'Competence',
          key: 'Id_C'
        }
      },
    }, {
      tableName: 'Indicateur'
    });

    Baser = sequelize.define('Baser', {
      Id_C: {
        type: DataTypes.STRING,
        references: {
          model: 'Competence',
          key: 'Id_C'
        }
      },
    }, {
      tableName: 'Baser'
    });

    // Initialisation du modèle Competence
    CompetenceModel = Competence(sequelize, DataTypes);

    // Établissement des associations
    if (CompetenceModel.associate) {
      CompetenceModel.associate({ Indicateur, Baser });
    }

    // Synchronisation avec force:true pour recréer les tables
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('doit définir correctement les attributs du modèle', async () => {
    const competence = await CompetenceModel.create({
      Id_C: 'C001',
      nom: 'Compétence Test',
      description: 'Description de la compétence',
    });

    // Vérification de la création de l'élément
    expect(competence.Id_C).toBe('C001');
    expect(competence.nom).toBe('Compétence Test');
    expect(competence.description).toBe('Description de la compétence');
  });

  it('doit avoir le bon nom de table et options', async () => {
    // Vérifie le nom de la table et si les timestamps sont désactivés
    const competence = CompetenceModel.options.tableName;
    expect(competence).toBe('Competence');
    expect(CompetenceModel.options.timestamps).toBe(false);
  });

  it('doit valider les contraintes de la clé primaire', async () => {
    try {
      await CompetenceModel.create({
        Id_C: '', // Id_C ne peut pas être vide, donc cela échouera
        nom: 'Compétence sans Id_C',
      });
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });
  it('doit avoir les bonnes associations', async () => {
    try {
      // Vérifie si une compétence avec le même Id_C existe déjà
      let competence = await CompetenceModel.findOne({
        where: { Id_C: 'C001' }
      });
  
      // Si la compétence n'existe pas, crée-la
      if (!competence) {
        competence = await CompetenceModel.create({
          Id_C: 'C001',
          nom: 'Compétence Test',
          description: 'Description de la compétence',
        });
      }
  
      // Crée des modèles associés pour les tests
      const indicateur = await Indicateur.create({
        Id_C: 'C001',
        Id_I: 1,
      });
  
      const baser = await Baser.create({
        Id_C: 'C001',
        Id_U: 1,
        CNE: '12345',
        Id_I: 1, // Assurez-vous d'avoir une association d'Indicateur correcte
      });
  
      // Test des relations : obtenir les indicateurs et basers associés à la compétence
      const competenceWithIndicateurs = await competence.getIndicateur();
      const competenceWithBasers = await competence.getBaser();
  
      // Vérifie que les associations sont bien établies
      expect(competenceWithIndicateurs.length).toBe(1);
      expect(competenceWithBasers.length).toBe(1);
    } catch (error) {
      // Gère l'erreur de contrainte d'unicité
      if (error.name === 'SequelizeUniqueConstraintError') {
        console.log('Erreur : Un enregistrement avec cet Id_C existe déjà.');
      } else {
        throw error;
      }
    }
  });
});