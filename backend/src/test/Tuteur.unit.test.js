import { describe, it, expect, beforeEach, vi } from 'vitest';
import TuteurModel from './Tuteur.js';

describe('Tuteur Model', () => {
  let Tuteur;
  let mockSequelize;
  let mockDataTypes;
  let mockModels;

  beforeEach(() => {
    mockModels = {
      Utilisateur: {}
    };

    mockDataTypes = {
      INTEGER: 'INTEGER',
      STRING: 'STRING'
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
            if (!data.Id_U) {
              return Promise.reject(new Error('Id_U is required'));
            }
            return Promise.resolve({
              ...data,
              specialite: data.specialite || null
            });
          })
        };
        return model;
      }),
      models: mockModels
    };

    Tuteur = TuteurModel(mockSequelize, mockDataTypes);
  });

  describe('Model Definition', () => {
    it('should define the Tuteur model with correct attributes', () => {
      expect(mockSequelize.define).toHaveBeenCalledWith(
        'Tuteur',
        {
          Id_U: {
            type: 'INTEGER',
            primaryKey: true,
            references: {
              model: 'Utilisateur',
              key: 'Id_U'
            }
          },
          specialite: 'STRING'
        },
        {
          tableName: 'Tuteur',
          timestamps: false
        }
      );
    });

    it('should set up the correct association with Utilisateur', () => {
      Tuteur.associate(mockModels);
      expect(Tuteur.belongsTo).toHaveBeenCalledWith(mockModels.Utilisateur, {
        foreignKey: 'Id_U'
      });
    });
  });

  describe('Validations', () => {
    it('should require Id_U field', async () => {
      // Test with required field
      await expect(Tuteur.create({
        Id_U: 1
      })).resolves.toBeTruthy();

      // Test missing Id_U
      await expect(Tuteur.create({
        specialite: 'Informatique'
      })).rejects.toThrow('Id_U is required');
    });
  });

  describe('Optional Fields', () => {
    it('should allow null for specialite field', async () => {
      const tuteur = await Tuteur.create({
        Id_U: 1,
        specialite: null
      });
      expect(tuteur.specialite).toBeNull();
    });

    it('should accept valid specialite value', async () => {
      const tuteur = await Tuteur.create({
        Id_U: 1,
        specialite: 'Mathématiques'
      });
      expect(tuteur.specialite).toBe('Mathématiques');
    });
  });

  describe('Foreign Key Reference', () => {
    it('should have correct reference to Utilisateur', () => {
      expect(Tuteur.Id_U.references).toEqual({
        model: 'Utilisateur',
        key: 'Id_U'
      });
    });
  });

  describe('Table Configuration', () => {
    it('should use the correct table name', () => {
      expect(Tuteur.tableName).toBe('Tuteur');
    });

    it('should not use timestamps', () => {
      expect(Tuteur.timestamps).toBe(false);
    });
  });
});