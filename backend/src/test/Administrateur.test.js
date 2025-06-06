import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import Administrateur from './Administrateur.js';

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
      // Ajoutez d'autres champs si nécessaire
    }, {
      tableName: 'Utilisateur' // Nom exact de la table
    });

    // 3. Initialisation du modèle Administrateur
    AdministrateurModel = Administrateur(sequelize, DataTypes);

    // 4. Établissement manuel des associations
    if (AdministrateurModel.associate) {
      AdministrateurModel.associate({ Utilisateur });
    }

    // 5. Synchronisation avec force:true pour recréer les tables
    await sequelize.sync({ force: true });
    
    // Vérification des tables créées (debug)
    const tables = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    console.log('Tables créées:', tables[0].map(t => t.name));
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('doit créer un administrateur avec un utilisateur lié', async () => {
    // Création d'un utilisateur
    const user = await Utilisateur.create({ Id_U: 1 });
    
    // Création de l'administrateur
    const admin = await AdministrateurModel.create({ Id_U: user.Id_U });

    // Vérifications
    expect(admin.Id_U).toBe(user.Id_U);
    expect(admin.Id_A).toBeDefined();

    // Vérification de la relation
    const loadedAdmin = await AdministrateurModel.findOne({
      where: { Id_A: admin.Id_A },
      include: [{
        model: Utilisateur,
        as: 'utilisateur',
        required: true
      }]
    });
    
    expect(loadedAdmin.utilisateur.Id_U).toBe(user.Id_U);
  });
});