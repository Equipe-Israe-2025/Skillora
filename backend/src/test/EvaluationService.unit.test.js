import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as EvaluationService from './EvaluationService.js'

// Mock du contenu de ../sync.js
vi.mock('../sync.js', () => {
  return {
    Evaluation: {
      create: vi.fn(),
      findAll: vi.fn(),
      findByPk: vi.fn()
    },
    Indicateur: {
      findAll: vi.fn()
    },
    Competence: {
      findAll: vi.fn()
    },
    Baser: {
      bulkCreate: vi.fn(),
      destroy: vi.fn()
    },
    Utilisateur: {} // inutile ici, mais requis
  }
})

// Mock de sequelize avec transaction
vi.mock('../config/db.js', () => {
  return {
    default: {
      transaction: vi.fn(() => ({
        commit: vi.fn(),
        rollback: vi.fn()
      }))
    }
  }
})

// Réimporter après les mocks
import { Evaluation, Indicateur, Competence, Baser } from '../sync.js'
import sequelize from '../config/db.js'

describe('EvaluationService - test unitaire de createEvaluation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait créer une évaluation avec indicateurs valides et aucune évaluation existante', async () => {
    const mockEvaluationData = {
      date: new Date(),
      commentaire: 'Bon travail',
      type: 'Oral',
      note: 17,
      CNE: 'CNE1234',
      indicateurIds: [1, 2]
    }

    const mockEvaluatorId = 10

    // 1. Mock des indicateurs
    Indicateur.findAll.mockResolvedValue([
      { Id_I: 1, competence: { Id_C: 1 } },
      { Id_I: 2, competence: { Id_C: 2 } }
    ])

    // 2. Pas d’évaluations existantes
    Evaluation.findAll.mockResolvedValue([])

    // 3. Mock de la création d’évaluation
    Evaluation.create.mockResolvedValue({ Id_eval: 42 })

    // 4. Mock des insertions dans Baser
    Baser.bulkCreate.mockResolvedValue(true)

    // 5. Mock du résultat final de findByPk
    Evaluation.findByPk.mockResolvedValue({
      Id_eval: 42,
      date: mockEvaluationData.date,
      commentaire: mockEvaluationData.commentaire,
      note: mockEvaluationData.note,
      type: mockEvaluationData.type
    })

    const result = await EvaluationService.createEvaluation(mockEvaluationData, mockEvaluatorId)

    expect(result).toBeDefined()
    expect(result.Id_eval).toBe(42)
    expect(Indicateur.findAll).toHaveBeenCalled()
    expect(Evaluation.create).toHaveBeenCalled()
    expect(Baser.bulkCreate).toHaveBeenCalled()
    expect(Evaluation.findByPk).toHaveBeenCalledWith(42, expect.any(Object))
  })

  it('devrait échouer si des indicateurs sont manquants', async () => {
    Indicateur.findAll.mockResolvedValue([{ Id_I: 1, competence: { Id_C: 1 } }])

    const data = {
      indicateurIds: [1, 2],
      CNE: 'CNE1234'
    }

    await expect(EvaluationService.createEvaluation(data, 5)).rejects.toThrow(
      'Indicateurs non trouvés: 2'
    )
  })

  it('devrait échouer si les compétences ont déjà été évaluées ce mois-ci', async () => {
    Indicateur.findAll.mockResolvedValue([
      { Id_I: 1, competence: { Id_C: 1 } }
    ])

    Evaluation.findAll.mockResolvedValue([
      {
        baser: [
          { Id_C: 1 }
        ]
      }
    ])

    Competence.findAll.mockResolvedValue([
      { Id_C: 1, nom: 'Algorithmique' }
    ])

    const data = {
      indicateurIds: [1],
      CNE: 'CNE1234'
    }

    await expect(EvaluationService.createEvaluation(data, 5)).rejects.toThrow(
      'Évaluations existantes pour les compétences: Algorithmique'
    )
  })
})
