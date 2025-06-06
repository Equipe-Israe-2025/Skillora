import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Sequelize, DataTypes } from 'sequelize'
import defineSolutionProposee from './Solution_Proposee' // adapte ce chemin si nécessaire
import defineProposer from './Proposer' // importe aussi ce modèle si tu veux tester les associations réelles

describe('Solution_Proposee Model', () => {
  let sequelize
  let Solution_Proposee
  let Proposer

  beforeEach(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false })

    // Définir les deux modèles
    Proposer = defineProposer(sequelize, DataTypes)
    Solution_Proposee = defineSolutionProposee(sequelize, DataTypes)

    // Déclarer l'association
    if (Solution_Proposee.associate) {
      Solution_Proposee.associate(sequelize.models)
    }

    await sequelize.sync({ force: true })
  })

  it('should define the model correctly', () => {
    expect(Solution_Proposee).toBeDefined()
    const attributes = Solution_Proposee.getAttributes()
    expect(attributes.nom).toBeDefined()
    expect(attributes.type).toBeDefined()
  })

  it('should associate with Proposer model correctly', () => {
    const association = Solution_Proposee.associations.Proposers
    expect(association).toBeDefined()
    expect(association.foreignKey).toBe('Id_SP')
  })

  it('should create a Solution_Proposee instance', async () => {
    const sp = await Solution_Proposee.create({
      type: 'Technique',
      nom: 'Solution A',
      description: 'Description test',
      dateDebut: new Date(),
      dateFin: new Date()
    })

    expect(sp).toBeDefined()
    expect(sp.nom).toBe('Solution A')
  })
})
