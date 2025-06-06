import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Mock des modules
vi.mock('../sync.js', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  // Modèles de base
  const CompetenceMock = dbMock.define('Competence', {
    Id_C: 1,
    nom: 'Compétence Test'
  });

  const IndicateurMock = dbMock.define('Indicateur', {
    Id_I: 1,
    libelle: 'Indicateur Test',
    competence: CompetenceMock.build({ Id_C: 1, nom: 'Compétence Test' })
  });

  const UtilisateurMock = dbMock.define('Utilisateur', {
    Id_U: 1,
    nom: 'Evaluateur Test',
    role: 'formateur',
    taux: 0.5
  });

  const EvaluationMock = dbMock.define('Evaluation', {
    Id_E: 1,
    note: 15,
    commentaire: 'Commentaire test',
    createdAt: new Date()
  });

  const BaserMock = dbMock.define('Baser', {
    Id_B: 1,
    indicateur: IndicateurMock.build({
      Id_I: 1,
      libelle: 'Indicateur Test',
      competence: CompetenceMock.build({ Id_C: 1, nom: 'Compétence Test' })
    })
  });

  // Configuration des relations
  EvaluationMock.belongsTo(UtilisateurMock, { as: 'evaluateur' });
  BaserMock.belongsTo(IndicateurMock, { as: 'indicateur' });
  BaserMock.belongsTo(EvaluationMock, { as: 'Evaluation' });
  EvaluationMock.hasMany(BaserMock, { as: 'baser' });
  IndicateurMock.belongsTo(CompetenceMock, { as: 'competence' });

  // Données de test
  const testEvaluation = EvaluationMock.build({
    Id_E: 1,
    note: 15,
    commentaire: 'Commentaire test',
    evaluateur: UtilisateurMock.build({
      Id_U: 1,
      nom: 'Evaluateur Test',
      role: 'formateur',
      taux: 0.5
    }),
    baser: [
      BaserMock.build({
        indicateur: IndicateurMock.build({
          competence: CompetenceMock.build({ Id_C: 1, nom: 'Compétence 1' })
        })
      }),
      BaserMock.build({
        indicateur: IndicateurMock.build({
          competence: CompetenceMock.build({ Id_C: 2, nom: 'Compétence 2' })
        })
      })
    ]
  });

  const testBasers = [
    BaserMock.build({
      Evaluation: EvaluationMock.build({
        note: 15,
        commentaire: 'Commentaire 1',
        evaluateur: UtilisateurMock.build({ nom: 'Eval 1', role: 'role 1' }),
        createdAt: new Date()
      }),
      indicateur: IndicateurMock.build({
        libelle: 'Indicateur 1',
        competence: CompetenceMock.build({ Id_C: 1, nom: 'Compétence 1' })
      })
    }),
    BaserMock.build({
      Evaluation: EvaluationMock.build({
        note: 18,
        commentaire: 'Commentaire 2',
        evaluateur: UtilisateurMock.build({ nom: 'Eval 2', role: 'role 2' }),
        createdAt: new Date()
      }),
      indicateur: IndicateurMock.build({
        libelle: 'Indicateur 2',
        competence: CompetenceMock.build({ Id_C: 1, nom: 'Compétence 1' })
      })
    })
  ];

  // Spies pour les méthodes
  const evaluationFindAllSpy = vi.fn().mockResolvedValue([testEvaluation]);
  const baserFindAllSpy = vi.fn().mockResolvedValue(testBasers);

  EvaluationMock.findAll = evaluationFindAllSpy;
  BaserMock.findAll = baserFindAllSpy;

  return {
    Evaluation: EvaluationMock,
    Indicateur: IndicateurMock,
    Competence: CompetenceMock,
    Utilisateur: UtilisateurMock,
    Baser: BaserMock,
    sequelize: { sync: vi.fn(), close: vi.fn() }
  };
});

dotenv.config();

import { Evaluation, Baser } from '../sync.js';
import { getMoyenneParCompetence, getRapportParCompetence } from './StatistiqueService.js';

describe('Statistique Service - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMoyenneParCompetence', () => {
    it('should calculate averages by competence', async () => {
      const result = await getMoyenneParCompetence();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('competenceId');
      expect(result[0]).toHaveProperty('competenceNom');
      expect(result[0]).toHaveProperty('moyenne');
      
      expect(Evaluation.findAll).toHaveBeenCalledWith({
        include: expect.arrayContaining([
          expect.objectContaining({
            model: expect.anything(),
            as: 'baser',
            include: expect.arrayContaining([
              expect.objectContaining({
                model: expect.anything(),
                as: 'indicateur',
                include: expect.arrayContaining([
                  expect.objectContaining({
                    model: expect.anything(),
                    as: 'competence'
                  })
                ])
              })
            ])
          }),
          expect.objectContaining({
            model: expect.anything(),
            as: 'evaluateur',
            attributes: ['Id_U', 'role', 'taux']
          })
        ])
      });
    });

    it('should filter by competence when Id_C is provided', async () => {
      const result = await getMoyenneParCompetence(1);
      
      expect(result.length).toBe(1);
      expect(result[0].competenceId).toBe('1');
    });
  });

  describe('getRapportParCompetence', () => {
    it('should generate report by competence', async () => {
      const result = await getRapportParCompetence();
      
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBeGreaterThan(0);
      expect(Array.isArray(result['Compétence 1'])).toBe(true);
      expect(result['Compétence 1'][0]).toHaveProperty('indicateur');
      expect(result['Compétence 1'][0]).toHaveProperty('note');
      expect(result['Compétence 1'][0]).toHaveProperty('commentaire');
      
      expect(Baser.findAll).toHaveBeenCalledWith({
        include: expect.arrayContaining([
          expect.objectContaining({
            model: expect.anything(),
            as: 'Evaluation',
            include: expect.arrayContaining([
              expect.objectContaining({
                model: expect.anything(),
                as: 'evaluateur',
                attributes: ['Id_U', 'nom', 'role']
              })
            ])
          }),
          expect.objectContaining({
            model: expect.anything(),
            as: 'indicateur',
            include: expect.arrayContaining([
              expect.objectContaining({
                model: expect.anything(),
                as: 'competence'
              })
            ])
          })
        ]),
        order: [['createdAt', 'DESC']]
      });
    });

    it('should filter report by competence when Id_C is provided', async () => {
      const result = await getRapportParCompetence(1);
      
      expect(Object.keys(result).length).toBe(1);
      expect(result['Compétence 1']).toBeDefined();
    });
  });
});