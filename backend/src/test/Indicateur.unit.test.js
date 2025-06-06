import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ValidationError } from 'sequelize';
import NotificationModel from './Notification.js';

describe('Notification Model', () => {
  let Notification;
  let mockSequelize;
  let mockDataTypes;
  let mockModels;

  beforeEach(() => {
    mockModels = {
      Utilisateur: {}
    };

    mockDataTypes = {
      INTEGER: 'INTEGER',
      STRING: 'STRING',
      TEXT: 'TEXT',
      BOOLEAN: 'BOOLEAN',
      DATE: 'DATE',
      ENUM: vi.fn().mockReturnValue('ENUM'),
      JSONB: 'JSONB',
      NOW: 'NOW'
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
            // Validation pour titre
            if (!data.titre || data.titre.trim() === '') {
              return Promise.reject(new ValidationError('titre cannot be empty'));
            }
            if (data.titre.length < 5 || data.titre.length > 100) {
              return Promise.reject(
                new ValidationError('titre length must be between 5 and 100 characters')
              );
            }
            
            // Validation pour contenu
            if (!data.contenu || data.contenu.trim() === '') {
              return Promise.reject(new ValidationError('contenu cannot be empty'));
            }
            
            // Validation pour Id_U
            if (!data.Id_U) {
              return Promise.reject(new ValidationError('Id_U is required'));
            }
            
            return Promise.resolve({
              ...data,
              Id_N: 1,
              lu: data.lu !== undefined ? data.lu : false,
              date: data.date || new Date(),
              type: data.type || 'systeme'
            });
          })
        };
        return model;
      }),
      models: mockModels
    };

    Notification = NotificationModel(mockSequelize, mockDataTypes);
  });

  describe('Model Definition', () => {
    it('should define the Notification model with correct attributes', () => {
      expect(mockSequelize.define).toHaveBeenCalledWith(
        'Notification',
        expect.objectContaining({
          Id_N: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
          },
          titre: {
            type: 'STRING',
            allowNull: false,
            validate: {
              notEmpty: true,
              len: [5, 100]
            }
          },
          contenu: {
            type: 'TEXT',
            allowNull: false
          },
          lu: {
            type: 'BOOLEAN',
            defaultValue: false
          },
          date: {
            type: 'DATE',
            defaultValue: 'NOW'
          },
          Id_U: {
            type: 'INTEGER',
            allowNull: false,
            references: {
              model: 'Utilisateur',
              key: 'Id_U'
            }
          },
          type: {
            type: 'ENUM',
            allowNull: false,
            defaultValue: 'systeme'
          },
          lien: {
            type: 'STRING',
            allowNull: true
          },
          metadata: {
            type: 'JSONB',
            allowNull: true
          }
        }),
        expect.objectContaining({
          tableName: 'Notification',
          timestamps: false,
          indexes: [
            {
              fields: ['Id_U', 'lu']
            }
          ]
        })
      );
    });

    it('should set up the correct association with Utilisateur', () => {
      Notification.associate(mockModels);
      
      expect(Notification.belongsTo).toHaveBeenCalledWith(mockModels.Utilisateur, {
        foreignKey: 'Id_U',
        as: 'destinataire'
      });
    });
  });

  describe('Validations', () => {
    it('should validate that titre is not empty and has correct length', async () => {
      // Titre vide
      await expect(Notification.create({
        titre: '',
        contenu: 'Contenu valide',
        Id_U: 1
      })).rejects.toThrow(ValidationError);

      // Titre trop court
      await expect(Notification.create({
        titre: '1234',
        contenu: 'Contenu valide',
        Id_U: 1
      })).rejects.toThrow(ValidationError);

      // Titre trop long
      await expect(Notification.create({
        titre: 'a'.repeat(101),
        contenu: 'Contenu valide',
        Id_U: 1
      })).rejects.toThrow(ValidationError);

      // Titre valide
      await expect(Notification.create({
        titre: 'Titre valide',
        contenu: 'Contenu valide',
        Id_U: 1
      })).resolves.toBeTruthy();
    });

    it('should validate that contenu is not empty', async () => {
      await expect(Notification.create({
        titre: 'Titre valide',
        contenu: '',
        Id_U: 1
      })).rejects.toThrow(ValidationError);

      await expect(Notification.create({
        titre: 'Titre valide',
        contenu: 'Contenu valide',
        Id_U: 1
      })).resolves.toBeTruthy();
    });

    it('should validate that Id_U is required', async () => {
      await expect(Notification.create({
        titre: 'Titre valide',
        contenu: 'Contenu valide',
        Id_U: null
      })).rejects.toThrow(ValidationError);

      await expect(Notification.create({
        titre: 'Titre valide',
        contenu: 'Contenu valide',
        Id_U: 1
      })).resolves.toBeTruthy();
    });
  });

  describe('Default Values', () => {
    it('should set default value for lu to false', async () => {
      const notification = await Notification.create({
        titre: 'Titre valide',
        contenu: 'Contenu valide',
        Id_U: 1
      });
      expect(notification.lu).toBe(false);
    });

    it('should set default value for date to current date', async () => {
      const before = new Date();
      const notification = await Notification.create({
        titre: 'Titre valide',
        contenu: 'Contenu valide',
        Id_U: 1
      });
      const after = new Date();
      
      expect(notification.date).toBeInstanceOf(Date);
      expect(notification.date.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(notification.date.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should set default value for type to "systeme"', async () => {
      const notification = await Notification.create({
        titre: 'Titre valide',
        contenu: 'Contenu valide',
        Id_U: 1
      });
      expect(notification.type).toBe('systeme');
    });
  });

  describe('Optional Fields', () => {
    it('should accept null for lien field', async () => {
      await expect(Notification.create({
        titre: 'Titre valide',
        contenu: 'Contenu valide',
        Id_U: 1,
        lien: null
      })).resolves.toBeTruthy();
    });

    it('should accept null for metadata field', async () => {
      await expect(Notification.create({
        titre: 'Titre valide',
        contenu: 'Contenu valide',
        Id_U: 1,
        metadata: null
      })).resolves.toBeTruthy();
    });

    it('should accept valid JSON for metadata field', async () => {
      const metadata = { action: 'view', entity: 'evaluation', id: 123 };
      const notification = await Notification.create({
        titre: 'Titre valide',
        contenu: 'Contenu valide',
        Id_U: 1,
        metadata
      });
      expect(notification.metadata).toEqual(metadata);
    });
  });

  describe('Indexes', () => {
    it('should have correct indexes defined', () => {
      expect(Notification.indexes).toEqual([
        {
          fields: ['Id_U', 'lu']
        }
      ]);
    });
  });
});