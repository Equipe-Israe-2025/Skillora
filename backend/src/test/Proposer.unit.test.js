import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProposerModel from './Proposer.js';

describe('Proposer Model', () => {
  let Proposer;
  let mockSequelize;
  let mockDataTypes;
  let mockModels;

  beforeEach(() => {
    mockModels = {
      Signalement: {},
      Solution_Proposee: {}
    };

    mockDataTypes = {
      INTEGER: 'INTEGER'
    };

    mockSequelize = {
      define: vi.fn().mockImplementation((modelName, attributes, options) => {
        const model = {
          ...attributes,
          ...options,
          associate: vi.fn(),
          belongsTo: vi.fn(),
          findAll: vi.fn(),
          findOne: vi.fn(),
          findByPk: vi.fn(),
          create: vi.fn().mockImplementation((data) => {
            // Validation des clés primaires
            if (!data.Id_S || !data.Id_SP) {
              return Promise.reject(new Error('Les deux clés primaires sont requises'));
            }
            return Promise.resolve(data);
          })
        };
        return model;
      }),
      models: mockModels
    };

    Proposer = ProposerModel(mockSequelize, mockDataTypes);
  });

  describe('Définition du modèle', () => {
    it('devrait définir correctement les attributs du modèle', () => {
      expect(mockSequelize.define).toHaveBeenCalledWith(
        'Proposer',
        {
          Id_S: {
            type: 'INTEGER',
            primaryKey: true,
            references: {
              model: 'Signalement',
              key: 'Id_S'
            }
          },
          Id_SP: {
            type: 'INTEGER',
            primaryKey: true,
            references: {
              model: 'Solution_Proposee',
              key: 'Id_SP'
            }
          }
        },
        {
          tableName: 'Proposer',
          timestamps: false
        }
      );
    });

    it('devrait établir les bonnes associations', () => {
      Proposer.associate(mockModels);
      
      // Vérifie l'association avec Signalement
      expect(Proposer.belongsTo).toHaveBeenCalledWith(mockModels.Signalement, {
        foreignKey: 'Id_S',
        as: 'signalement'
      });
      
      // Vérifie l'association avec Solution_Proposee
      expect(Proposer.belongsTo).toHaveBeenCalledWith(mockModels.Solution_Proposee, {
        foreignKey: 'Id_SP',
        as: 'solution'
      });
    });
  });

  describe('Validations', () => {
    it('devrait exiger les deux clés primaires', async () => {
      // Test avec les deux clés
      await expect(Proposer.create({
        Id_S: 1,
        Id_SP: 1
      })).resolves.toBeTruthy();

      // Test avec Id_S manquant
      await expect(Proposer.create({
        Id_SP: 1
      })).rejects.toThrow('Les deux clés primaires sont requises');

      // Test avec Id_SP manquant
      await expect(Proposer.create({
        Id_S: 1
      })).rejects.toThrow('Les deux clés primaires sont requises');
    });
  });

  describe('Références de clé étrangère', () => {
    it('devrait avoir la bonne référence vers Signalement', () => {
      expect(Proposer.Id_S.references).toEqual({
        model: 'Signalement',
        key: 'Id_S'
      });
    });

    it('devrait avoir la bonne référence vers Solution_Proposee', () => {
      expect(Proposer.Id_SP.references).toEqual({
        model: 'Solution_Proposee',
        key: 'Id_SP'
      });
    });
  });

  describe('Configuration de la table', () => {
    it('devrait utiliser le bon nom de table', () => {
      expect(Proposer.tableName).toBe('Proposer');
    });

    it('ne devrait pas utiliser de timestamps', () => {
      expect(Proposer.timestamps).toBe(false);
    });
  });
});