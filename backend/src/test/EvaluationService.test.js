import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as EvaluationService from './EvaluationService.js'

// Mock des modèles
vi.mock('../sync.js', () => {
  const SequelizeMock = require('sequelize-mock')
  const dbMock = new SequelizeMock()

  const EvaluationMock = dbMock.define('Evaluation', {
    Id_eval: 1,
    date: new Date(),
    type: 'Oral',
    commentaire: 'Très bien',
    note: 18,
    CNE: 'CNE1234',
    Id_U: 2
  })

  EvaluationMock.findByPk = vi.fn((id) => {
    if (id === 1) return Promise.resolve(EvaluationMock.build())
    return Promise.resolve(null)
  })

  const IndicateurMock = dbMock.define('Indicateur', {})
  const CompetenceMock = dbMock.define('Competence', {})
  const BaserMock = dbMock.define('Baser', {})
  const UtilisateurMock = dbMock.define('Utilisateur', {})

  return {
    Evaluation: EvaluationMock,
    Indicateur: IndicateurMock,
    Competence: CompetenceMock,
    Baser: BaserMock,
    Utilisateur: UtilisateurMock
  }
})

// Mock de sequelize (transaction)
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

describe('EvaluationService mock integration tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait récupérer toutes les évaluations', async () => {
    const result = await EvaluationService.getAllEvaluations()
    expect(Array.isArray(result)).toBe(true)
  })

  it('devrait renvoyer les détails d\'une évaluation', async () => {
    const evalId = 1
    const result = await EvaluationService.getEvaluationDetails(evalId)
    expect(result.Id_eval).toBe(evalId)
  })

  it('devrait échouer si l\'évaluation est introuvable', async () => {
    await expect(EvaluationService.getEvaluationDetails(999)).rejects.toThrow('Évaluation non trouvée')
  })

  it('devrait supprimer une évaluation', async () => {
    const result = await EvaluationService.deleteEvaluation(1)
    expect(result.success).toBe(true)
    expect(result.message).toBe('Évaluation supprimée avec succès')
  })
})
