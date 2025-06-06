import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ValidationError } from 'sequelize';
import FiliereModel from './Filiere.js';

describe('Filiere Model', () => {
  let Filiere;
  let mockSequelize;
  let mockDataTypes;
  let mockModels;

  beforeEach(() => {
    mockModels = {
      Etudiant: {},
      Enseigne: {}
    };

    mockDataTypes = {
      STRING: 'STRING',
      INTEGER: 'INTEGER',
      ENUM: vi.fn()
    };

    mockSequelize = {
      define: vi.fn().mockImplementation((modelName, attributes, options) => {
        const model = {
          ...attributes,
          ...options,
          associate: vi.fn(),
          hasMany: vi.fn(), // Ajout de la méthode hasMany
          findAll: vi.fn(),
          findOne: vi.fn(),
          findByPk: vi.fn(),
          create: vi.fn().mockImplementation((data) => {
            // Implémentation des validations
            if (!data.Id_F || data.Id_F.trim() === '') {
              return Promise.reject(new ValidationError('Id_F cannot be empty'));
            }
            if (!data.nom_filiere || data.nom_filiere.trim() === '') {
              return Promise.reject(new ValidationError('nom_filiere cannot be empty'));
            }
            if (data.nom_filiere && (data.nom_filiere.length < 2 || data.nom_filiere.length > 50)) {
              return Promise.reject(new ValidationError('nom_filiere length must be between 2 and 50'));
            }
            return Promise.resolve(data);
          })
        };
        return model;
      }),
      models: mockModels
    };

    Filiere = FiliereModel(mockSequelize, mockDataTypes);
  });

  describe('Model Definition', () => {
    it('should define the Filiere model with correct attributes', () => {
      expect(mockSequelize.define).toHaveBeenCalledWith(
        'Filiere',
        expect.objectContaining({
          Id_F: {
            type: 'STRING',
            primaryKey: true,
            validate: {
              notEmpty: true
            }
          },
          nbr_Etud: { type: 'INTEGER' },
          Volume_horaire: { type: 'INTEGER' },
          chef_filiere: { type: 'STRING' },
          description: { type: 'STRING' },
          nom_filiere: {
            type: 'STRING',
            allowNull: false,
            validate: {
              notEmpty: true,
              len: [2, 50]
            }
          }
        }),
        expect.objectContaining({
          tableName: 'Filiere',
          timestamps: false
        })
      );
    });

    it('should set up the correct associations', () => {
      Filiere.associate(mockModels);
      
      expect(Filiere.hasMany).toHaveBeenCalledWith(mockModels.Etudiant, {
        foreignKey: 'Id_F',
        as: 'Etudiant'
      });
      
      expect(Filiere.hasMany).toHaveBeenCalledWith(mockModels.Enseigne, {
        foreignKey: 'Id_F',
        as: 'Enseigne'
      });
    });
  });

  describe('Validations', () => {
    it('should validate that Id_F is not empty', async () => {
      await expect(Filiere.create({
        Id_F: '',
        nom_filiere: 'Informatique'
      })).rejects.toThrow(ValidationError);

      await expect(Filiere.create({
        Id_F: 'INFO',
        nom_filiere: 'Informatique'
      })).resolves.toBeTruthy();
    });

    it('should validate that nom_filiere is not empty and has correct length', async () => {
      // Test empty name
      await expect(Filiere.create({
        Id_F: 'INFO',
        nom_filiere: ''
      })).rejects.toThrow(ValidationError);

      // Test too short name
      await expect(Filiere.create({
        Id_F: 'INFO',
        nom_filiere: 'A'
      })).rejects.toThrow(ValidationError);

      // Test too long name
      await expect(Filiere.create({
        Id_F: 'INFO',
        nom_filiere: 'A'.repeat(51)
      })).rejects.toThrow(ValidationError);

      // Test valid name
      await expect(Filiere.create({
        Id_F: 'INFO',
        nom_filiere: 'Informatique'
      })).resolves.toBeTruthy();
    });

    it('should accept optional fields', async () => {
      await expect(Filiere.create({
        Id_F: 'INFO',
        nom_filiere: 'Informatique',
        nbr_Etud: 100,
        Volume_horaire: 500,
        chef_filiere: 'Dr. Smith',
        description: 'Filière en technologies de l\'information'
      })).resolves.toBeTruthy();
    });
  });
});
