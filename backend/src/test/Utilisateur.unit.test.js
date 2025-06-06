import { describe, it, expect, vi, beforeAll } from 'vitest';
import bcrypt from 'bcrypt';
import utilisateurModel from './Utilisateur';

// Mock plus complet de Sequelize
const mockSequelize = {
  define: vi.fn().mockImplementation((modelName, columns, options) => {
    // Création d'un mock plus réaliste du modèle
    const model = {
      modelName,
      columns,
      options,
      beforeValidate: vi.fn(),
      beforeSave: vi.fn(),
      associate: vi.fn(),
      getAttributes: vi.fn(() => columns),
      addHook: vi.fn(),
      // Ajout des méthodes d'association
      hasMany: vi.fn(),
      hasOne: vi.fn(),
      belongsTo: vi.fn(),
      belongsToMany: vi.fn(),
    };
    return model;
  }),
};

const mockDataTypes = {
  INTEGER: vi.fn(),
  STRING: vi.fn(),
  FLOAT: vi.fn(),
  ENUM: vi.fn(),
};

describe('Modèle Utilisateur - Tests Unitaires', () => {
  let Utilisateur;

  beforeAll(() => {
    Utilisateur = utilisateurModel(mockSequelize, mockDataTypes);
  });

  it('devrait définir correctement le modèle', () => {
    expect(Utilisateur.modelName).toBe('Utilisateur');
    expect(Utilisateur.options).toEqual({
      tableName: 'Utilisateur',
      timestamps: false
    });
  });

  describe('Structure du modèle', () => {
    it('devrait avoir les champs obligatoires', () => {
      expect(Utilisateur.columns).toMatchObject({
        Id_U: {
          type: mockDataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nom: {
          type: mockDataTypes.STRING,
          allowNull: false
        },
        prenom: {
          type: mockDataTypes.STRING,
          allowNull: false
        },
        email: {
          type: mockDataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        password: {
          type: mockDataTypes.STRING,
          allowNull: false
        },
        role: {
          type: mockDataTypes.ENUM('Etudiant', 'Administrateur', 'Encadrant', 'Tuteur'),
          allowNull: false
        }
      });
    });

    it('devrait avoir les champs optionnels', () => {
      expect(Utilisateur.columns.image).toEqual({
        type: mockDataTypes.STRING,
        allowNull: true
      });
      expect(Utilisateur.columns.taux).toBe(mockDataTypes.FLOAT);
    });
  });

  describe('Hooks', () => {
    it('devrait avoir un hook beforeSave pour hacher le mot de passe', () => {
      expect(Utilisateur.addHook).toHaveBeenCalledWith(
        'beforeSave',
        expect.any(Function)
      );
    });

    it('devrait hacher le mot de passe avant sauvegarde', async () => {
      const mockUser = {
        password: 'password123',
        changed: vi.fn().mockReturnValue(true)
      };
      const hook = Utilisateur.addHook.mock.calls[0][1];
      
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      
      await hook(mockUser);
      
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUser.password).toBe('hashedPassword');
    });
  });

  describe('Associations', () => {
    it('devrait définir une méthode associate', () => {
      expect(Utilisateur.associate).toBeDefined();
    });

    it('devrait configurer les associations correctement', () => {
      const mockModels = {
        Notification: {},
        Etudiant: {},
        Encadrant: {},
        Evaluation: {},
        Baser: {},
        Badge: {},
        Signalement: {},
        Administrateur: {},
        Tuteur: {}
      };
      
      Utilisateur.associate(mockModels);
      
      // Vérification des associations
      expect(Utilisateur.hasMany).toHaveBeenCalledWith(mockModels.Notification, { foreignKey: 'Id_U' });
      expect(Utilisateur.hasOne).toHaveBeenCalledWith(mockModels.Etudiant, { foreignKey: 'Id_U' });
      expect(Utilisateur.hasOne).toHaveBeenCalledWith(mockModels.Encadrant, { foreignKey: 'Id_U' });
      expect(Utilisateur.hasMany).toHaveBeenCalledWith(mockModels.Evaluation, { foreignKey: 'Id_U' });
      expect(Utilisateur.hasMany).toHaveBeenCalledWith(mockModels.Baser, { foreignKey: 'Id_U' });
      expect(Utilisateur.hasMany).toHaveBeenCalledWith(mockModels.Badge, { foreignKey: 'Id_U' });
      expect(Utilisateur.hasMany).toHaveBeenCalledWith(mockModels.Signalement, { foreignKey: 'Id_U' });
      expect(Utilisateur.hasOne).toHaveBeenCalledWith(mockModels.Administrateur, { foreignKey: 'Id_U' });
      expect(Utilisateur.hasOne).toHaveBeenCalledWith(mockModels.Tuteur, { foreignKey: 'Id_U' });
    });
  });
});