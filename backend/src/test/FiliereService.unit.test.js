import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as FiliereService from './FiliereService.js'

// Mock du modèle Filiere
vi.mock('../sync.js', () => ({
  Filiere: {
    create: vi.fn(),
    findByPk: vi.fn()
  }
}))

import { Filiere } from '../sync.js'

describe('FiliereService - Tests unitaires', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait créer une filière', async () => {
    const data = { Id_F: 'F001', nom: 'Génie Informatique' }
    Filiere.create.mockResolvedValue(data)

    const result = await FiliereService.createFiliere(data)

    expect(Filiere.create).toHaveBeenCalledWith(data)
    expect(result).toEqual(data)
  })

  it('devrait mettre à jour une filière existante', async () => {
    const mockFiliere = {
      update: vi.fn().mockResolvedValue({ Id_F: 'F001', nom: 'Maths Appliquées' })
    }

    Filiere.findByPk.mockResolvedValue(mockFiliere)

    const result = await FiliereService.updateFiliere('F001', { nom: 'Maths Appliquées' })

    expect(Filiere.findByPk).toHaveBeenCalledWith('F001')
    expect(mockFiliere.update).toHaveBeenCalledWith({ nom: 'Maths Appliquées' })
    expect(result.nom).toBe('Maths Appliquées')
  })

  it('devrait échouer si la filière à mettre à jour n\'existe pas', async () => {
    Filiere.findByPk.mockResolvedValue(null)

    await expect(FiliereService.updateFiliere('INVALID', { nom: 'X' }))
      .rejects.toThrow('Filière non trouvée')
  })

  it('devrait supprimer une filière existante', async () => {
    const mockFiliere = {
      destroy: vi.fn().mockResolvedValue()
    }

    Filiere.findByPk.mockResolvedValue(mockFiliere)

    const result = await FiliereService.deleteFiliere('F001')

    expect(Filiere.findByPk).toHaveBeenCalledWith('F001')
    expect(mockFiliere.destroy).toHaveBeenCalled()
    expect(result.message).toBe('Filière supprimée avec succès')
  })

  it('devrait échouer si la filière à supprimer n\'existe pas', async () => {
    Filiere.findByPk.mockResolvedValue(null)

    await expect(FiliereService.deleteFiliere('INVALID'))
      .rejects.toThrow('Filière non trouvée')
  })
})
