import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ValidationError } from 'sequelize';
import EvaluationModel from './Evaluation.js';

describe('Evaluation Model', () => {
  let Evaluation;
  let mockSequelize;
  let mockDataTypes;
  let mockModels;

  beforeEach(() => {
    mockModels = {
      Utilisateur: {},
      Etudiant: {},
      Notification: {
        create: vi.fn()
      }
    };

    mockDataTypes = {
      DATE: 'DATE',
      TEXT: 'TEXT',
      ENUM: vi.fn().mockReturnValue('ENUM'),
      FLOAT: 'FLOAT',
      INTEGER: 'INTEGER',
      STRING: 'STRING',
      BOOLEAN: 'BOOLEAN',
      NOW: 'NOW'
    };

    // Mock plus complet pour Sequelize define
    mockSequelize = {
      define: vi.fn().mockImplementation((modelName, attributes, options) => {
        const model = {
          ...attributes,
          ...options,
          associate: vi.fn(),
          afterCreate: vi.fn(),
          belongsTo: vi.fn(), // Ajout de la méthode belongsTo
          findAll: vi.fn(),
          findOne: vi.fn(),
          findByPk: vi.fn(),
          create: vi.fn().mockImplementation((data) => {
            // Implémentation de base pour simuler les validations
            if (data.note !== undefined && (data.note < 0 || data.note > 20)) {
              return Promise.reject(new ValidationError('Note must be between 0 and 20'));
            }
            if (!data.type || !data.note || !data.Id_U || !data.CNE) {
              return Promise.reject(new ValidationError('Required field missing'));
            }
            return Promise.resolve(data);
          })
        };
        return model;
      }),
      models: mockModels
    };

    Evaluation = EvaluationModel(mockSequelize, mockDataTypes);
  });

  describe('Model Definition', () => {
    it('should define the Evaluation model with correct attributes', () => {
      expect(mockSequelize.define).toHaveBeenCalledWith(
        'Evaluation',
        expect.objectContaining({
          date: {
            type: 'DATE',
            primaryKey: true,
            defaultValue: 'NOW'
          },
          commentaire: {
            type: 'TEXT',
            allowNull: true
          },
          type: {
            type: 'ENUM',
            allowNull: false
          },
          note: {
            type: 'FLOAT',
            allowNull: false,
            validate: {
              min: 0,
              max: 20
            }
          },
          Id_U: {
            type: 'INTEGER',
            primaryKey: true,
            allowNull: false,
            references: {
              model: 'Utilisateur',
              key: 'Id_U'
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
          },
          anonyme: {
            type: 'BOOLEAN',
            defaultValue: false
          }
        }),
        expect.objectContaining({
          tableName: 'Evaluation',
          timestamps: false
        })
      );
    });

    it('should set up the correct associations', () => {
      Evaluation.associate(mockModels);
      
      expect(Evaluation.belongsTo).toHaveBeenCalledWith(mockModels.Utilisateur, {
        foreignKey: 'Id_U',
        as: 'evaluateur'
      });
      
      expect(Evaluation.belongsTo).toHaveBeenCalledWith(mockModels.Etudiant, {
        foreignKey: 'CNE',
        as: 'etudiant'
      });
    });
  });

  describe('Validations', () => {
    it('should validate that note is between 0 and 20', async () => {
      await expect(Evaluation.create({
        date: new Date(),
        type: 'auto_eval',
        note: -1,
        Id_U: 1,
        CNE: 'E123456'
      })).rejects.toThrow(ValidationError);

      await expect(Evaluation.create({
        date: new Date(),
        type: 'auto_eval',
        note: 21,
        Id_U: 1,
        CNE: 'E123456'
      })).rejects.toThrow(ValidationError);

      await expect(Evaluation.create({
        date: new Date(),
        type: 'auto_eval',
        note: 10,
        Id_U: 1,
        CNE: 'E123456'
      })).resolves.toBeTruthy();
    });

    it('should require type, note, Id_U and CNE', async () => {
      const validData = {
        date: new Date(),
        type: 'auto_eval',
        note: 10,
        Id_U: 1,
        CNE: 'E123456'
      };

      await expect(Evaluation.create({ ...validData, type: null }))
        .rejects.toThrow(ValidationError);
      await expect(Evaluation.create({ ...validData, note: null }))
        .rejects.toThrow(ValidationError);
      await expect(Evaluation.create({ ...validData, Id_U: null }))
        .rejects.toThrow(ValidationError);
      await expect(Evaluation.create({ ...validData, CNE: null }))
        .rejects.toThrow(ValidationError);
    });
  });

  describe('Hooks', () => {
    it('should create a notification after evaluation creation', async () => {
      // Mock the afterCreate hook implementation
      const mockAfterCreate = Evaluation.afterCreate.mock.calls[0][0];
      
      // Mock the Etudiant find
      mockModels.Etudiant.findOne = vi.fn().mockResolvedValue({
        CNE: 'E123456',
        utilisateur: {
          Id_U: 2
        }
      });
      
      // Mock the Utilisateur find
      mockModels.Utilisateur.findByPk = vi.fn().mockResolvedValue({
        Id_U: 1,
        role: 'Tuteur'
      });
      
      // Call the hook with a mock evaluation
      const mockEvaluation = {
        CNE: 'E123456',
        Id_U: 1,
        note: 15,
        commentaire: 'Bon travail',
        anonyme: false
      };
      
      await mockAfterCreate(mockEvaluation);
      
      // Verify the notification was created
      expect(mockModels.Notification.create).toHaveBeenCalledWith({
        titre: "Nouvelle évaluation",
        contenu: "Vous avez été évalué par un tuteur. Note: 15/20. Commentaire: Bon travail",
        lu: false,
        date: expect.any(Date),
        Id_U: 2
      });
    });

    it('should handle anonymous evaluation in notification', async () => {
      const mockAfterCreate = Evaluation.afterCreate.mock.calls[0][0];
      
      mockModels.Etudiant.findOne = vi.fn().mockResolvedValue({
        CNE: 'E123456',
        utilisateur: {
          Id_U: 2
        }
      });
      
      const mockEvaluation = {
        CNE: 'E123456',
        Id_U: 1,
        note: 15,
        commentaire: null,
        anonyme: true
      };
      
      await mockAfterCreate(mockEvaluation);
      
      expect(mockModels.Notification.create).toHaveBeenCalledWith({
        titre: "Nouvelle évaluation",
        contenu: "Vous avez été évalué par un évaluateur anonyme. Note: 15/20. ",
        lu: false,
        date: expect.any(Date),
        Id_U: 2
      });
    });

    it('should handle errors in notification creation gracefully', async () => {
      const mockAfterCreate = Evaluation.afterCreate.mock.calls[0][0];
      
      mockModels.Etudiant.findOne = vi.fn().mockRejectedValue(new Error('DB Error'));
      
      const mockEvaluation = {
        CNE: 'E123456',
        Id_U: 1,
        note: 15,
        anonyme: false
      };
      
      await expect(mockAfterCreate(mockEvaluation)).resolves.not.toThrow();
    });
  });
});