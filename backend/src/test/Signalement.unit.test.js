import { describe, it, expect, beforeEach, vi } from 'vitest';
import SignalementModel from './Signalement.js';

describe('Signalement Model', () => {
  let Signalement;
  let mockSequelize;
  let mockDataTypes;
  let mockModels;

  beforeEach(() => {
    mockModels = {
      Utilisateur: {},
      Etudiant: {},
      Proposer: {},
      Notification: {
        create: vi.fn()
      }
    };

    mockDataTypes = {
      INTEGER: 'INTEGER',
      DATE: 'DATE',
      STRING: 'STRING',
      NOW: 'NOW'
    };

    mockSequelize = {
      define: vi.fn().mockImplementation((modelName, attributes, options) => {
        const model = {
          ...attributes,
          ...options,
          associate: vi.fn(),
          belongsTo: vi.fn(),
          hasMany: vi.fn(),
          findAll: vi.fn(),
          findOne: vi.fn(),
          findByPk: vi.fn(),
          create: vi.fn().mockImplementation((data) => {
            if (!data.description || !data.Id_U || !data.CNE) {
              return Promise.reject(new Error('Champs requis manquants'));
            }
            return Promise.resolve({
              ...data,
              Id_S: 1,
              date: data.date || new Date(),
              statut: data.statut || 'En attente',
              count: data.count || 1
            });
          })
        };
        
        // Ajout du hook afterCreate
        model.afterCreate = vi.fn();
        
        return model;
      }),
      models: {
        ...mockModels,
        Etudiant: {
          findOne: vi.fn()
        },
        Utilisateur: {
          findByPk: vi.fn()
        },
        Notification: {
          create: vi.fn()
        }
      }
    };

    Signalement = SignalementModel(mockSequelize, mockDataTypes);
  });

  describe('Définition du modèle', () => {
    it('devrait définir correctement les attributs', () => {
      expect(mockSequelize.define).toHaveBeenCalledWith(
        'Signalement',
        {
          Id_S: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
          },
          date: {
            type: 'DATE',
            defaultValue: 'NOW'
          },
          description: {
            type: 'STRING',
            allowNull: false
          },
          statut: {
            type: 'STRING',
            defaultValue: 'En attente'
          },
          count: {
            type: 'INTEGER',
            defaultValue: 1
          },
          Id_U: {
            type: 'INTEGER',
            allowNull: false
          },
          CNE: {
            type: 'STRING',
            allowNull: false
          }
        },
        {
          tableName: 'Signalement',
          timestamps: false
        }
      );
    });

    it('devrait établir les bonnes associations', () => {
      Signalement.associate(mockModels);
      
      expect(Signalement.belongsTo).toHaveBeenCalledWith(mockModels.Utilisateur, {
        foreignKey: 'Id_U'
      });
      
      expect(Signalement.belongsTo).toHaveBeenCalledWith(mockModels.Etudiant, {
        foreignKey: 'CNE'
      });
      
      expect(Signalement.hasMany).toHaveBeenCalledWith(mockModels.Proposer, {
        foreignKey: 'Id_S'
      });
    });
  });

  describe('Validations', () => {
    it('devrait exiger les champs obligatoires', async () => {
      await expect(Signalement.create({
        description: 'Description valide',
        Id_U: 1,
        CNE: 'E123456'
      })).resolves.toBeTruthy();

      await expect(Signalement.create({
        Id_U: 1,
        CNE: 'E123456'
      })).rejects.toThrow('Champs requis manquants');

      await expect(Signalement.create({
        description: 'Description valide',
        CNE: 'E123456'
      })).rejects.toThrow('Champs requis manquants');

      await expect(Signalement.create({
        description: 'Description valide',
        Id_U: 1
      })).rejects.toThrow('Champs requis manquants');
    });
  });

  describe('Valeurs par défaut', () => {
    it('devrait définir les valeurs par défaut', async () => {
      const signalement = await Signalement.create({
        description: 'Description',
        Id_U: 1,
        CNE: 'E123456'
      });
      
      expect(signalement.statut).toBe('En attente');
      expect(signalement.count).toBe(1);
      expect(signalement.date).toBeInstanceOf(Date);
    });
  });

  describe('Hook afterCreate', () => {
    it('devrait créer une notification après création', async () => {
      // Configurer les mocks
      const mockEtudiant = {
        CNE: 'E123456',
        Id_U: 2,
        utilisateur: { Id_U: 2 }
      };
      
      const mockAuteur = {
        Id_U: 1,
        role: 'Encadrant',
        prenom: 'Jean',
        nom: 'Dupont'
      };
      
      mockSequelize.models.Etudiant.findOne.mockResolvedValue(mockEtudiant);
      mockSequelize.models.Utilisateur.findByPk.mockResolvedValue(mockAuteur);
      
      // Récupérer la fonction afterCreate
      const afterCreate = Signalement.afterCreate.mock.calls[0][0];
      
      // Appeler le hook
      await afterCreate({
        Id_S: 1,
        CNE: 'E123456',
        Id_U: 1,
        description: 'Problème de comportement'
      }, {});
      
      // Vérifier que la notification a été créée
      expect(mockSequelize.models.Notification.create).toHaveBeenCalledWith({
        titre: "Nouveau signalement",
        contenu: "Vous avez été signalé par votre encadrant (Jean Dupont) pour: Problème de comportement. Veuillez consulter votre encadrant pour plus d'informations.",
        lu: false,
        date: expect.any(Date),
        Id_U: 2
      });
    });

    it('devrait gérer les différents types d\'auteurs', async () => {
      const testCases = [
        { role: 'Encadrant', expected: 'votre encadrant' },
        { role: 'Tuteur', expected: 'votre tuteur' },
        { role: 'Administrateur', expected: 'l\'administration' },
        { role: 'Etudiant', expected: 'un autre étudiant' },
        { role: 'Autre', expected: 'un membre de l\'équipe' }
      ];
      
      for (const testCase of testCases) {
        const mockEtudiant = {
          CNE: 'E123456',
          Id_U: 2,
          utilisateur: { Id_U: 2 }
        };
        
        const mockAuteur = {
          Id_U: 1,
          role: testCase.role,
          prenom: 'Test',
          nom: 'User'
        };
        
        mockSequelize.models.Etudiant.findOne.mockResolvedValue(mockEtudiant);
        mockSequelize.models.Utilisateur.findByPk.mockResolvedValue(mockAuteur);
        
        const afterCreate = Signalement.afterCreate.mock.calls[0][0];
        
        await afterCreate({
          Id_S: 1,
          CNE: 'E123456',
          Id_U: 1,
          description: 'Test'
        }, {});
        
        expect(mockSequelize.models.Notification.create).toHaveBeenCalledWith(
          expect.objectContaining({
            contenu: expect.stringContaining(testCase.expected)
          })
        );
      }
    });

    it('devrait gérer les erreurs silencieusement', async () => {
      mockSequelize.models.Etudiant.findOne.mockRejectedValue(new Error('DB Error'));
      
      const afterCreate = Signalement.afterCreate.mock.calls[0][0];
      
      await expect(afterCreate({
        Id_S: 1,
        CNE: 'E123456',
        Id_U: 1,
        description: 'Test'
      }, {})).resolves.not.toThrow();
    });
  });
});