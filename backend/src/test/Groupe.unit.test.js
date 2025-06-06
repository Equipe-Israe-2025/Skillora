import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ValidationError } from 'sequelize';
import GroupeModel from './Groupe.js';

describe('Groupe Model', () => {
  let Groupe;
  let mockSequelize;
  let mockDataTypes;
  let mockModels;

  beforeEach(() => {
    mockModels = {
      Forme: {}
    };

    mockDataTypes = {
      INTEGER: 'INTEGER',
      STRING: 'STRING',
      ENUM: vi.fn()
    };

    mockSequelize = {
      define: vi.fn().mockImplementation((modelName, attributes, options) => {
        const currentYear = new Date().getFullYear();
        
        const model = {
          ...attributes,
          ...options,
          associate: vi.fn(),
          hasMany: vi.fn(),
          findAll: vi.fn(),
          findOne: vi.fn(),
          findByPk: vi.fn(),
          create: vi.fn().mockImplementation((data) => {
            // Validation pour nom_groupe
            if (!data.nom_groupe || data.nom_groupe.trim() === '') {
              return Promise.reject(new ValidationError('nom_groupe cannot be empty'));
            }
            
            // Validation pour Annee
            if (data.Annee === undefined || data.Annee === null) {
              return Promise.reject(new ValidationError('Annee is required'));
            }
            
            if (!Number.isInteger(data.Annee)) {
              return Promise.reject(new ValidationError('Annee must be an integer'));
            }
            
            if (data.Annee < 2000 || data.Annee > currentYear + 5) {
              return Promise.reject(
                new ValidationError(`Annee must be between 2000 and ${currentYear + 5}`)
              );
            }
            
            return Promise.resolve(data);
          })
        };
        return model;
      }),
      models: mockModels
    };

    Groupe = GroupeModel(mockSequelize, mockDataTypes);
  });

  describe('Model Definition', () => {
    it('should define the Groupe model with correct attributes', () => {
      expect(mockSequelize.define).toHaveBeenCalledWith(
        'Groupe',
        {
          Id_G: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
          },
          nom_groupe: {
            type: 'STRING',
            allowNull: false,
            validate: {
              notEmpty: true
            }
          },
          Annee: {
            type: 'INTEGER',
            allowNull: false,
            validate: {
              isInt: true,
              min: 2000,
              max: expect.any(Number)
            }
          }
        },
        {
          tableName: 'Groupe',
          timestamps: false,
          indexes: [
            {
              unique: true,
              fields: ['nom_groupe', 'Annee']
            }
          ]
        }
      );
    });

    it('should set up the correct association with Forme', () => {
      Groupe.associate(mockModels);
      expect(Groupe.hasMany).toHaveBeenCalledWith(mockModels.Forme, {
        foreignKey: 'Id_G',
        as: 'groupe'
      });
    });
  });

  describe('Validations', () => {
    it('should validate that nom_groupe is not empty', async () => {
      const currentYear = new Date().getFullYear();
      
      await expect(Groupe.create({
        nom_groupe: '',
        Annee: currentYear
      })).rejects.toThrow(ValidationError);

      await expect(Groupe.create({
        nom_groupe: 'Groupe A',
        Annee: currentYear
      })).resolves.toBeTruthy();
    });

    it('should validate that Annee is an integer between 2000 and current year + 5', async () => {
      const currentYear = new Date().getFullYear();
      
      await expect(Groupe.create({
        nom_groupe: 'Groupe A',
        Annee: 1999
      })).rejects.toThrow(ValidationError);
      
      await expect(Groupe.create({
        nom_groupe: 'Groupe A',
        Annee: currentYear + 6
      })).rejects.toThrow(ValidationError);
      
      await expect(Groupe.create({
        nom_groupe: 'Groupe A',
        Annee: 2023.5
      })).rejects.toThrow(ValidationError);
      
      await expect(Groupe.create({
        nom_groupe: 'Groupe A',
        Annee: 2000
      })).resolves.toBeTruthy();
      
      await expect(Groupe.create({
        nom_groupe: 'Groupe A',
        Annee: currentYear + 5
      })).resolves.toBeTruthy();
    });

    it('should enforce unique constraint on nom_groupe and Annee combination', () => {
      expect(Groupe.indexes).toEqual([
        {
          unique: true,
          fields: ['nom_groupe', 'Annee']
        }
      ]);
    });
  });

  describe('Auto-increment', () => {
    it('should have auto-increment enabled for Id_G', () => {
      expect(Groupe.Id_G.autoIncrement).toBe(true);
    });
  });
});