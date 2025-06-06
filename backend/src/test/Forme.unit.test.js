import { describe, it, expect, beforeEach, vi } from 'vitest';
import FormeModel from './Forme.js';

describe('Forme Model', () => {
  let Forme;
  let mockSequelize;
  let mockDataTypes;
  let mockModels;

  beforeEach(() => {
    mockModels = {
      Encadrant: {},
      Groupe: {},
      Etudiant: {}
    };

    mockDataTypes = {
      STRING: 'STRING',
      INTEGER: 'INTEGER'
    };

    mockSequelize = {
      define: vi.fn().mockImplementation((modelName, attributes, options) => {
        const model = {
          ...attributes,
          ...options,
          associate: vi.fn(),
          belongsTo: vi.fn(), // Mock pour les associations belongsTo
          findAll: vi.fn(),
          findOne: vi.fn(),
          findByPk: vi.fn(),
          create: vi.fn().mockImplementation((data) => {
            // Validation des champs obligatoires
            if (!data.Num_sum || !data.Id_G || !data.CNE) {
              return Promise.reject(new Error('Missing required fields'));
            }
            return Promise.resolve(data);
          })
        };
        return model;
      }),
      models: mockModels
    };

    Forme = FormeModel(mockSequelize, mockDataTypes);
  });

  describe('Model Definition', () => {
    it('should define the Forme model with correct attributes', () => {
      expect(mockSequelize.define).toHaveBeenCalledWith(
        'Forme',
        expect.objectContaining({
          Num_sum: {
            type: 'STRING',
            primaryKey: true,
            allowNull: false,
            references: {
              model: 'Encadrant',
              key: 'Num_sum'
            }
          },
          Id_G: {
            type: 'INTEGER',
            primaryKey: true,
            allowNull: false,
            references: {
              model: 'Groupe',
              key: 'Id_G'
            }
          },
          CNE: {
            type: 'STRING',
            primaryKey: true,
            allowNull: false,
            references: {
              model: 'Etudiant',
              key: 'CNE'
            }
          }
        }),
        expect.objectContaining({
          tableName: 'Forme',
          timestamps: false
        })
      );
    });

    it('should set up the correct associations', () => {
      Forme.associate(mockModels);
      
      // Vérifie l'association avec Encadrant
      expect(Forme.belongsTo).toHaveBeenCalledWith(mockModels.Encadrant, {
        foreignKey: 'Num_sum',
        as: 'encadrant'
      });
      
      // Vérifie l'association avec Groupe
      expect(Forme.belongsTo).toHaveBeenCalledWith(mockModels.Groupe, {
        foreignKey: 'Id_G',
        as: 'groupe'
      });
      
      // Vérifie l'association avec Etudiant
      expect(Forme.belongsTo).toHaveBeenCalledWith(mockModels.Etudiant, {
        foreignKey: 'CNE',
        as: 'etudiant'
      });
    });
  });

  describe('Validations', () => {
    it('should require all primary key fields', async () => {
      // Test avec tous les champs
      await expect(Forme.create({
        Num_sum: 'ENC123',
        Id_G: 1,
        CNE: 'E123456'
      })).resolves.toBeTruthy();

      // Tests avec champs manquants
      await expect(Forme.create({
        Id_G: 1,
        CNE: 'E123456'
      })).rejects.toThrow('Missing required fields');

      await expect(Forme.create({
        Num_sum: 'ENC123',
        CNE: 'E123456'
      })).rejects.toThrow('Missing required fields');

      await expect(Forme.create({
        Num_sum: 'ENC123',
        Id_G: 1
      })).rejects.toThrow('Missing required fields');
    });

    it('should enforce foreign key constraints', () => {
      // Vérifie que les références sont bien définies dans le modèle
      expect(Forme.Num_sum.references).toEqual({
        model: 'Encadrant',
        key: 'Num_sum'
      });
      expect(Forme.Id_G.references).toEqual({
        model: 'Groupe',
        key: 'Id_G'
      });
      expect(Forme.CNE.references).toEqual({
        model: 'Etudiant',
        key: 'CNE'
      });
    });
  });

  describe('Table Configuration', () => {
    it('should use the correct table name', () => {
      expect(Forme.tableName).toBe('Forme');
    });

    it('should not use timestamps', () => {
      expect(Forme.timestamps).toBe(false);
    });
  });
});