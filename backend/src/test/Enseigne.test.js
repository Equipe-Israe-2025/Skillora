import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';

// Setup des modèles nécessaires
const setupModels = () => {
  const sequelize = new Sequelize('sqlite::memory:', { logging: false });

  // Modèle Utilisateur
  const Utilisateur = sequelize.define('Utilisateur', {
    Id_U: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    mot_de_passe: DataTypes.STRING,
    role: DataTypes.STRING
  });

  // Modèle Encadrant
  const Encadrant = sequelize.define('Encadrant', {
    Num_sum: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    specialite: DataTypes.STRING,
    Id_U: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Utilisateurs', // Attention si tu as activé la casse sensible
        key: 'Id_U'
      }
    }
  });

  Encadrant.belongsTo(Utilisateur, { foreignKey: 'Id_U' });

  // Modèle Groupe
  const Groupe = sequelize.define('Groupe', {
    Id_G: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom_groupe: DataTypes.STRING
  });

  // Modèle Enseigne
  const Enseigne = sequelize.define('Enseigne', {
    Num_sum: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    Id_G: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'Enseigne',
    timestamps: false
  });

  Enseigne.belongsTo(Encadrant, { foreignKey: 'Num_sum', as: 'encadrant' });
  Enseigne.belongsTo(Groupe, { foreignKey: 'Id_G', as: 'groupe' });

  return { sequelize, Utilisateur, Encadrant, Groupe, Enseigne };
};

describe('Enseigne Model', () => {
  let sequelize;
  let models;

  beforeAll(async () => {
    models = setupModels();
    sequelize = models.sequelize;
    await sequelize.sync({ force: true });
  });

  test('doit créer un enregistrement Enseigne valide', async () => {
    // Créer d'abord un Utilisateur
    const utilisateur = await models.Utilisateur.create({
      nom: 'Test',
      prenom: 'Utilisateur',
      email: 'test@example.com',
      mot_de_passe: 'password',
      role: 'encadrant'
    });

    // Puis un Encadrant lié à cet utilisateur
    const encadrant = await models.Encadrant.create({
      Num_sum: 'ENC001',
      specialite: 'Informatique',
      Id_U: utilisateur.Id_U
    });

    // Puis un Groupe
    const groupe = await models.Groupe.create({
      nom_groupe: 'Groupe A'
    });

    // Enfin, créer un Enseigne liant Encadrant et Groupe
    const enseigne = await models.Enseigne.create({
      Num_sum: encadrant.Num_sum,
      Id_G: groupe.Id_G
    });

    // Vérifications
    expect(enseigne.Num_sum).toBe(encadrant.Num_sum);
    expect(enseigne.Id_G).toBe(groupe.Id_G);

    // Tester associations
    const assocEncadrant = await enseigne.getEncadrant();
    expect(assocEncadrant.Num_sum).toBe(encadrant.Num_sum);

    const assocGroupe = await enseigne.getGroupe();
    expect(assocGroupe.Id_G).toBe(groupe.Id_G);
  });

  afterAll(async () => {
    await sequelize.close();
  });
});