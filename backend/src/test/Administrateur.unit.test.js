import { Sequelize, DataTypes } from 'sequelize';
import Administrateur from './Administrateur.js'; 
import { describe, it, expect, beforeAll, afterAll } from 'vitest';


describe('Modèle Administrateur', () => {
  let sequelize;
  let Utilisateur;
  let AdministrateurModel;

  beforeAll(async () => {
    // 1. Configuration de Sequelize avec SQLite en mémoire
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
      define: {
        freezeTableName: true, // Empêche le pluriel automatique
        timestamps: false     // Désactive les timestamps
      }
    });

    // 2. Définition explicite du modèle Utilisateur
    Utilisateur = sequelize.define('Utilisateur', {
      Id_U: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Autres champs si nécessaire
    }, {
      tableName: 'Utilisateur'
    });

    // 3. Initialisation du modèle Administrateur
    AdministrateurModel = Administrateur(sequelize, DataTypes);

    // 4. Établissement des associations
    if (AdministrateurModel.associate) {
      AdministrateurModel.associate({ Utilisateur });
    }

    // 5. Synchronisation avec force:true pour recréer les tables
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('doit définir correctement les attributs du modèle', async () => {
    const admin = AdministrateurModel.build({
      Id_U: 1,
    });
    expect(admin.Id_U).toBe(1);
    expect(admin.Id_A).toBeDefined();
  });

  it('doit avoir le bon nom de table et options', async () => {
    expect(AdministrateurModel.getTableName()).toBe('Administrateur');
    expect(AdministrateurModel.options.timestamps).toBe(false);
  });
});
