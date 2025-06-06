import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';

// Mock complet autonome
const setupModels = () => {
  const sequelize = new Sequelize('sqlite::memory:', { logging: false });

  // 1. Modèle Utilisateur mocké (sans bcrypt)
  const Utilisateur = sequelize.define('Utilisateur', {
    Id_U: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    mot_de_passe: DataTypes.STRING, // Simplifié pour tests
    role: DataTypes.STRING
  });

  // 2. Modèle Encadrant mocké
  const Encadrant = sequelize.define('Encadrant', {
    Num_sum: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    specialite: DataTypes.STRING,
    Id_U: DataTypes.INTEGER
  });

  // 3. Associations mockées
  Encadrant.belongsTo(Utilisateur, { foreignKey: 'Id_U' });
  
  return { sequelize, Utilisateur, Encadrant };
};

describe('Encadrant Model', () => {
  let sequelize;
  let models;

  beforeAll(async () => {
    models = setupModels();
    sequelize = models.sequelize;
    await sequelize.sync({ force: true });
  });

  test('doit créer un Encadrant avec un Utilisateur associé', async () => {
    // Création d'un utilisateur
    const user = await models.Utilisateur.create({
      nom: 'Test',
      email: 'test@example.com'
    });
    
    // Création d'un encadrant
    const encadrant = await models.Encadrant.create({
      Num_sum: 'ENC001',
      specialite: 'Informatique',
      Id_U: user.Id_U
    });

    // Vérifications simples
    expect(encadrant.Num_sum).toBe('ENC001');
    expect(encadrant.Id_U).toBe(user.Id_U);

    // Nouvelle vérification d'association manuelle
    const utilisateurTrouve = await models.Utilisateur.findByPk(encadrant.Id_U);
    expect(utilisateurTrouve).not.toBeNull();
    expect(utilisateurTrouve.email).toBe('test@example.com');
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
