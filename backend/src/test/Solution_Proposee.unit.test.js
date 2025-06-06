import { describe, it, expect, beforeEach, vi } from 'vitest';
import SolutionProposeeModel from './Solution_Proposee.js';

describe('Solution_Proposee Model', () => {
  let SolutionProposee;
  let mockSequelize;
  let mockDataTypes;
  let mockModels;

  beforeEach(() => {
    mockModels = {
      Proposer: {}
    };

    mockDataTypes = {
      INTEGER: 'INTEGER',
      STRING: 'STRING',
      TEXT: 'TEXT',
      DATE: 'DATE'
    };

    mockSequelize = {
      define: vi.fn().mockImplementation((modelName, attributes, options) => {
        const model = {
          ...attributes,
          ...options,
          associate: vi.fn(),
          hasMany: vi.fn(),
          findAll: vi.fn(),
          findOne: vi.fn(),
          findByPk: vi.fn(),
          create: vi.fn().mockImplementation((data) => {
            // Validation des champs obligatoires
            if (!data.type || !data.nom) {
              return Promise.reject(new Error('type and nom are required'));
            }
            return Promise.resolve({
              ...data,
              Id_SP: 1,
              description: data.description || null,
              dateDebut: data.dateDebut || null,
              dateFin: data.dateFin || null
            });
          })
        };
        return model;
      }),
      models: mockModels
    };

    SolutionProposee = SolutionProposeeModel(mockSequelize, mockDataTypes);
  });

  describe('Model Definition', () => {
    it('should define the Solution_Proposee model with correct attributes', () => {
      expect(mockSequelize.define).toHaveBeenCalledWith(
        'Solution_Proposee',
        {
          Id_SP: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
          },
          type: {
            type: 'STRING',
            allowNull: false
          },
          nom: {
            type: 'STRING',
            allowNull: false
          },
          description: 'TEXT',
          dateDebut: 'DATE',
          dateFin: 'DATE'
        },
        {
          tableName: 'Solution_Proposee',
          timestamps: false
        }
      );
    });

    it('should set up the correct association with Proposer', () => {
      SolutionProposee.associate(mockModels);
      expect(SolutionProposee.hasMany).toHaveBeenCalledWith(mockModels.Proposer, {
        foreignKey: 'Id_SP'
      });
    });
  });

  describe('Validations', () => {
    it('should require type and nom fields', async () => {
      // Test with all required fields
      await expect(SolutionProposee.create({
        type: 'Solution Type',
        nom: 'Solution Name'
      })).resolves.toBeTruthy();

      // Test missing type
      await expect(SolutionProposee.create({
        nom: 'Solution Name'
      })).rejects.toThrow('type and nom are required');

      // Test missing nom
      await expect(SolutionProposee.create({
        type: 'Solution Type'
      })).rejects.toThrow('type and nom are required');
    });
  });

  describe('Optional Fields', () => {
    it('should allow null for description field', async () => {
      const solution = await SolutionProposee.create({
        type: 'Type',
        nom: 'Name',
        description: null
      });
      expect(solution.description).toBeNull();
    });

    it('should allow null for dateDebut field', async () => {
      const solution = await SolutionProposee.create({
        type: 'Type',
        nom: 'Name',
        dateDebut: null
      });
      expect(solution.dateDebut).toBeNull();
    });

    it('should allow null for dateFin field', async () => {
      const solution = await SolutionProposee.create({
        type: 'Type',
        nom: 'Name',
        dateFin: null
      });
      expect(solution.dateFin).toBeNull();
    });

    it('should accept valid dates for dateDebut and dateFin', async () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-12-31');
      
      const solution = await SolutionProposee.create({
        type: 'Type',
        nom: 'Name',
        dateDebut: startDate,
        dateFin: endDate
      });
      
      expect(solution.dateDebut).toEqual(startDate);
      expect(solution.dateFin).toEqual(endDate);
    });
  });

  describe('Auto-increment', () => {
    it('should have auto-increment enabled for Id_SP', () => {
      expect(SolutionProposee.Id_SP.autoIncrement).toBe(true);
    });
  });

  describe('Table Configuration', () => {
    it('should use the correct table name', () => {
      expect(SolutionProposee.tableName).toBe('Solution_Proposee');
    });

    it('should not use timestamps', () => {
      expect(SolutionProposee.timestamps).toBe(false);
    });
  });
});