// backend/src/services/StatistiqueService.unit.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMoyenneParCompetence, getRapportParCompetence } from './StatistiqueService.js';

// Mock complet des modèles Sequelize
vi.mock('../sync.js', () => {
  const CompetenceMock = {
    build: vi.fn()
  };

  const IndicateurMock = {
    build: vi.fn()
  };

  const UtilisateurMock = {
    build: vi.fn()
  };

  const EvaluationMock = {
    findAll: vi.fn(),
    build: vi.fn()
  };

  const BaserMock = {
    findAll: vi.fn(),
    build: vi.fn()
  };

  // Configuration des relations
  EvaluationMock.belongsTo = vi.fn();
  BaserMock.belongsTo = vi.fn();
  IndicateurMock.belongsTo = vi.fn();

  return {
    Evaluation: EvaluationMock,
    Baser: BaserMock,
    Indicateur: IndicateurMock,
    Competence: CompetenceMock,
    Utilisateur: UtilisateurMock,
    sequelize: {},
    Sequelize: class {},
  };
});

import { Evaluation, Baser } from '../sync.js';

describe('StatistiqueService - tests unitaires', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMoyenneParCompetence', () => {
    it('devrait calculer les moyennes pondérées par compétence', async () => {
      // Mock des données avec une structure complète
      Evaluation.findAll.mockResolvedValue([
        {
          note: 15,
          baser: [
            {
              indicateur: {
                competence: {
                  Id_C: 1,
                  nom: 'Compétence 1'
                }
              }
            }
          ],
          evaluateur: {
            taux: 0.5
          }
        },
        {
          note: 18,
          baser: [
            {
              indicateur: {
                competence: {
                  Id_C: 1,
                  nom: 'Compétence 1'
                }
              }
            }
          ],
          evaluateur: {
            taux: 0.5
          }
        }
      ]);

      const result = await getMoyenneParCompetence();

      expect(Evaluation.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        {
          competenceId: '1',
          competenceNom: 'Compétence 1',
          moyenne: '16.50'
        }
      ]);
    });

    it('devrait filtrer par compétence si Id_C est fourni', async () => {
      Evaluation.findAll.mockResolvedValue([
        {
          note: 15,
          baser: [
            {
              indicateur: {
                competence: {
                  Id_C: 1,
                  nom: 'Compétence 1'
                }
              }
            },
            {
              indicateur: {
                competence: {
                  Id_C: 2,
                  nom: 'Compétence 2'
                }
              }
            }
          ],
          evaluateur: {
            taux: 1.0
          }
        }
      ]);

      const result = await getMoyenneParCompetence(1);

      expect(result.length).toBe(1);
      expect(result[0].competenceId).toBe('1');
    });

    it('devrait retourner un tableau vide si aucune évaluation trouvée', async () => {
      Evaluation.findAll.mockResolvedValue([]);
      const result = await getMoyenneParCompetence();
      expect(result).toEqual([]);
    });
  });

  describe('getRapportParCompetence', () => {
    it('devrait générer un rapport groupé par compétence', async () => {
      const mockDate = new Date();
      Baser.findAll.mockResolvedValue([
        {
          Evaluation: {
            note: 15,
            commentaire: 'Bon travail',
            evaluateur: {
              Id_U: 1,
              nom: 'Formateur A',
              role: 'formateur'
            },
            createdAt: mockDate
          },
          indicateur: {
            libelle: 'Indicateur 1',
            competence: {
              Id_C: 1,
              nom: 'Compétence 1'
            }
          }
        }
      ]);

      const result = await getRapportParCompetence();

      expect(Baser.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        'Compétence 1': [
          {
            indicateur: 'Indicateur 1',
            note: 15,
            commentaire: 'Bon travail',
            evaluateur: 'Formateur A',
            role: 'formateur',
            date: mockDate
          }
        ]
      });
    });

    it('devrait filtrer par compétence si Id_C est fourni', async () => {
      Baser.findAll.mockResolvedValue([
        {
          Evaluation: {
            note: 15,
            commentaire: 'Commentaire',
            evaluateur: {
              Id_U: 1,
              nom: 'Eval',
              role: 'role'
            },
            createdAt: new Date()
          },
          indicateur: {
            libelle: 'Indicateur',
            competence: {
              Id_C: 1,
              nom: 'Compétence 1'
            }
          }
        }
      ]);

      const result = await getRapportParCompetence(1);
      expect(Object.keys(result)).toEqual(['Compétence 1']);
    });

    it('devrait retourner un objet vide si aucune donnée trouvée', async () => {
      Baser.findAll.mockResolvedValue([]);
      const result = await getRapportParCompetence();
      expect(result).toEqual({});
    });
  });
});