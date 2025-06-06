import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as FiliereService from './FiliereService.js'

// Mock du modèle Filiere via sequelize-mock
vi.mock('../sync.js', () => {
  const SequelizeMock = require('sequelize-mock')
  const dbMock = new SequelizeMock()

  const FiliereMock = dbMock.define('Filiere', {
    Id_F: 'F001',
    nom: 'Génie Informatique'
  })

  // Ajouter findByPk pour test update et delete
  FiliereMock.findByPk = vi.fn((id) => {
    if (id === 'F001') {
      return Promise.resolve(FiliereMock.build({
        Id_F: 'F001',
        nom: 'Génie Informatique'
      }))
    }
    return Promise.resolve(null)
  })

  return {
    Filiere: FiliereMock
  }
})

describe('FiliereService mock integration tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait créer une filière', async () => {
    const data = { Id_F: 'F001', nom: 'Génie Informatique' }
    const result = await FiliereService.createFiliere(data)

    expect(result).toBeDefined()
    expect(result.Id_F).toBe('F001')
    expect(result.nom).toBe('Génie Informatique')
  })

  it('devrait mettre à jour une filière existante', async () => {
    const result = await FiliereService.updateFiliere('F001', { nom: 'Maths Appliquées' })
    expect(result.nom).toBe('Maths Appliquées')
  })

  it('devrait échouer à mettre à jour une filière inexistante', async () => {
    await expect(FiliereService.updateFiliere('INVALID', { nom: 'X' }))
      .rejects.toThrow('Filière non trouvée')
  })

  it('devrait supprimer une filière existante', async () => {
    const result = await FiliereService.deleteFiliere('F001')
    expect(result.message).toBe('Filière supprimée avec succès')
  })

  it('devrait échouer à supprimer une filière inexistante', async () => {
    await expect(FiliereService.deleteFiliere('INVALID'))
      .rejects.toThrow('Filière non trouvée')
  })
})
