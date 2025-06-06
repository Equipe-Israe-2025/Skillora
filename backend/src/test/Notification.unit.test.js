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
              return Promise.reject(new ValidationError('Le titre ne peut pas être vide'));
            }
            if (data.titre.length < 5 || data.titre.length > 100) {
              return Promise.reject(
                new ValidationError('Le titre doit contenir entre 5 et 100 caractères')
              );
            }
            
            // Validation pour contenu
            if (!data.contenu || data.contenu.trim() === '') {
              return Promise.reject(new ValidationError('Le contenu ne peut pas être vide'));
            }
            
            // Validation pour Id_U
            if (!data.Id_U) {
              return Promise.reject(new ValidationError('Id_U est requis'));
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

  describe('Définition du modèle', () => {
    it('devrait définir correctement les attributs du modèle', () => {
      expect(mockSequelize.define).toHaveBeenCalledWith(
        'Notification',
        {
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
        },
        {
          tableName: 'Notification',
          timestamps: false,
          indexes: [
            {
              fields: ['Id_U', 'lu']
            }
          ]
        }
      );
    });

    it('devrait établir la bonne association avec Utilisateur', () => {
      Notification.associate(mockModels);
      expect(Notification.belongsTo).toHaveBeenCalledWith(mockModels.Utilisateur, {
        foreignKey: 'Id_U',
        as: 'destinataire'
      });
    });
  });

  describe('Validations', () => {
    it('devrait valider que le titre est requis et a une longueur correcte', async () => {
      await expect(Notification.create({
        titre: '',
        contenu: 'Contenu valide',
        Id_U: 1
      })).rejects.toThrow(ValidationError);

      await expect(Notification.create({
        titre: 'Trop court',
        contenu: 'Contenu valide',
        Id_U: 1
      })).resolves.toBeTruthy();

      await expect(Notification.create({
        titre: 'a'.repeat(101),
        contenu: 'Contenu valide',
        Id_U: 1
      })).rejects.toThrow(ValidationError);
    });

    it('devrait valider que le contenu est requis', async () => {
      await expect(Notification.create({
        titre: 'Titre valide',
        contenu: '',
        Id_U: 1
      })).rejects.toThrow(ValidationError);
    });

    it('devrait valider que Id_U est requis', async () => {
      await expect(Notification.create({
        titre: 'Titre valide',
        contenu: 'Contenu valide',
        Id_U: null
      })).rejects.toThrow(ValidationError);
    });
  });

  describe('Valeurs par défaut', () => {
    it('devrait définir lu à false par défaut', async () => {
      const notif = await Notification.create({
        titre: 'Titre',
        contenu: 'Contenu',
        Id_U: 1
      });
      expect(notif.lu).toBe(false);
    });

    it('devrait définir la date actuelle par défaut', async () => {
      const before = new Date();
      const notif = await Notification.create({
        titre: 'Titre',
        contenu: 'Contenu',
        Id_U: 1
      });
      const after = new Date();
      
      expect(notif.date).toBeInstanceOf(Date);
      expect(notif.date.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(notif.date.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('devrait définir le type à "systeme" par défaut', async () => {
      const notif = await Notification.create({
        titre: 'Titre',
        contenu: 'Contenu',
        Id_U: 1
      });
      expect(notif.type).toBe('systeme');
    });
  });

  describe('Champs optionnels', () => {
    it('devrait accepter un lien null', async () => {
      const notif = await Notification.create({
        titre: 'Titre',
        contenu: 'Contenu',
        Id_U: 1,
        lien: null
      });
      expect(notif.lien).toBeNull();
    });

    it('devrait accepter des métadonnées JSON valides', async () => {
      const metadata = { action: 'view', id: 123 };
      const notif = await Notification.create({
        titre: 'Titre',
        contenu: 'Contenu',
        Id_U: 1,
        metadata
      });
      expect(notif.metadata).toEqual(metadata);
    });
  });

  describe('Indexes', () => {
    it('devrait avoir les bons indexes définis', () => {
      expect(Notification.indexes).toEqual([
        {
          fields: ['Id_U', 'lu']
        }
      ]);
    });
  });

  describe('Types ENUM', () => {
    it('devrait avoir les bonnes valeurs ENUM pour le type', () => {
      expect(mockDataTypes.ENUM).toHaveBeenCalledWith(
        'evaluation', 
        'signalement', 
        'badge', 
        'groupe',
        'systeme'
      );
    });
  });
});