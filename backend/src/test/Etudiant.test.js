import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import etudiantModel from './Etudiant';

describe('Modèle Etudiant', () => {
  let sequelize;
  let Etudiant;
  let Utilisateur;
  let Filiere;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false
    });

    // Définition des modèles de base
    Utilisateur = sequelize.define('Utilisateur', {
      Id_U: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    }, {
      tableName: 'Utilisateur',
      timestamps: false
    });

    Filiere = sequelize.define('Filiere', {
      Id_F: {
        type: DataTypes.STRING,
        primaryKey: true
      }
    }, {
      tableName: 'Filiere',
      timestamps: false
    });

    // Définition du modèle Etudiant
    Etudiant = etudiantModel(sequelize, DataTypes);

    // Configuration des associations
    Etudiant.associate({ 
      Utilisateur,
      Filiere,
      Forme: sequelize.define('Forme', {}, { timestamps: false }),
      Badge: sequelize.define('Badge', {}, { timestamps: false }),
      Evaluation: sequelize.define('Evaluation', {}, { timestamps: false }),
      Baser: sequelize.define('Baser', {}, { timestamps: false }),
      Signalement: sequelize.define('Signalement', {}, { timestamps: false })
    });

    // Synchronisation de tous les modèles
    await sequelize.sync({ force: true });

    // Création des données de référence
    await Utilisateur.bulkCreate([
      { Id_U: 1 },
      { Id_U: 2 }
    ]);

    await Filiere.bulkCreate([
      { Id_F: 'FIL1' },
      { Id_F: 'FIL2' }  // Ajout de FIL2 pour les tests de mise à jour
    ]);
  });

  beforeEach(async () => {
    // Nettoyage des données étudiant seulement
    await Etudiant.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('CRUD', () => {
    it('doit créer et récupérer un étudiant', async () => {
      const etudiant = await Etudiant.create({
        CNE: 'G12345',
        Id_U: 1,
        Id_F: 'FIL1'
      });
      
      const found = await Etudiant.findByPk('G12345');
      expect(found).not.toBeNull();
      expect(found.CNE).toBe('G12345');
      expect(found.Id_F).toBe('FIL1');
    });

    it('doit mettre à jour un étudiant', async () => {
      // Création initiale avec FIL1
      const etudiant = await Etudiant.create({
        CNE: 'G12345',
        Id_U: 1,
        Id_F: 'FIL1'
      });

      // Mise à jour vers FIL2 (qui doit exister)
      await etudiant.update({ Id_F: 'FIL2' });
      
      // Vérification
      const updated = await Etudiant.findByPk('G12345');
      expect(updated.Id_F).toBe('FIL2');
    });

    it('doit supprimer un étudiant', async () => {
      const etudiant = await Etudiant.create({
        CNE: 'G12345',
        Id_U: 1,
        Id_F: 'FIL1'
      });
      
      await etudiant.destroy();
      const found = await Etudiant.findByPk('G12345');
      expect(found).toBeNull();
    });
  });
});