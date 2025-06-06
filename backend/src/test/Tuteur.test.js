import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

// Configuration de la base de données de test (SQLite en mémoire)
const sequelize = new Sequelize('sqlite::memory:', {
  logging: false // Désactive les logs pour les tests
});

// Import des modèles
async function setupModels() {
  // Définition du modèle Utilisateur
  const Utilisateur = sequelize.define('Utilisateur', {
    Id_U: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    role: DataTypes.ENUM('Etudiant', 'Administrateur', 'Encadrant', 'Tuteur'),
    taux: DataTypes.FLOAT
  }, {
    tableName: 'Utilisateur',
    timestamps: false
  });

  // Définition du modèle Tuteur
  const Tuteur = sequelize.define('Tuteur', {
    Id_U: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Utilisateur',
        key: 'Id_U'
      }
    },
    specialite: DataTypes.STRING
  }, {
    tableName: 'Tuteur',
    timestamps: false
  });

  // Configuration des associations
  Utilisateur.hasOne(Tuteur, { foreignKey: 'Id_U' });
  Tuteur.belongsTo(Utilisateur, { foreignKey: 'Id_U' });

  // Synchronisation des modèles avec la base de données
  await Utilisateur.sync({ force: true });
  await Tuteur.sync({ force: true });

  return { Utilisateur, Tuteur };
}

describe('Modèle Tuteur', () => {
  let Tuteur, Utilisateur;

  beforeAll(async () => {
    // Initialisation des modèles avec synchronisation
    const models = await setupModels();
    Tuteur = models.Tuteur;
    Utilisateur = models.Utilisateur;
  });

  afterAll(async () => {
    // Fermeture de la connexion
    await sequelize.close();
  });

  it('devrait avoir les champs corrects définis', () => {
    const attributes = Tuteur.getAttributes();
    
    expect(attributes).toHaveProperty('Id_U');
    expect(attributes.Id_U.type).toEqual(DataTypes.INTEGER());
    expect(attributes.Id_U.primaryKey).toBe(true);
    
    expect(attributes).toHaveProperty('specialite');
    expect(attributes.specialite.type).toEqual(DataTypes.STRING());
  });

  it('devrait avoir une association avec Utilisateur', () => {
    expect(Tuteur.associations.Utilisateur).toBeDefined();
    expect(Tuteur.associations.Utilisateur.associationType).toBe('BelongsTo');
  });

  it('devrait être créé avec un utilisateur associé', async () => {
    // Création d'un utilisateur
    const user = await Utilisateur.create({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Tuteur',
      taux: 0.5
    });

    // Création d'un tuteur associé
    const tuteur = await Tuteur.create({
      Id_U: user.Id_U,
      specialite: 'Informatique'
    });

    expect(tuteur.Id_U).toBe(user.Id_U);
    expect(tuteur.specialite).toBe('Informatique');

    // Vérification de l'association
    const associatedUser = await tuteur.getUtilisateur();
    expect(associatedUser.Id_U).toBe(user.Id_U);
    expect(associatedUser.nom).toBe('Dupont');
  });

  it('devrait échouer si Id_U ne correspond pas à un utilisateur existant', async () => {
    await expect(
      Tuteur.create({
        Id_U: 999, // ID inexistant
        specialite: 'Mathématiques'
      })
    ).rejects.toThrow();
  });

  it('devrait permettre la création même si l\'utilisateur associé n\'a pas le rôle Tuteur', async () => {
    // Création d'un utilisateur avec un rôle différent
    const user = await Utilisateur.create({
      nom: 'Martin',
      prenom: 'Sophie',
      email: 'sophie.martin@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Etudiant',
      taux: 0.0
    });

    // La création devrait réussir car le modèle actuel ne vérifie pas le rôle
    const tuteur = await Tuteur.create({
      Id_U: user.Id_U,
      specialite: 'Physique'
    });

    expect(tuteur.Id_U).toBe(user.Id_U);
    expect(tuteur.specialite).toBe('Physique');
  });
});