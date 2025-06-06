import { describe, it, expect, beforeAll, vi } from 'vitest'
import { Sequelize, DataTypes } from 'sequelize'
import defineSignalement from './Signalement.js'

describe('Signalement Model', () => {
  let sequelize, Signalement

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false })

    // Définir les modèles nécessaires
    const Utilisateur = sequelize.define('Utilisateur', {
      Id_U: { type: DataTypes.INTEGER, primaryKey: true },
      role: DataTypes.STRING,
      prenom: DataTypes.STRING,
      nom: DataTypes.STRING
    }, { timestamps: false })

    const Etudiant = sequelize.define('Etudiant', {
      CNE: { type: DataTypes.STRING, primaryKey: true },
      Id_U: DataTypes.INTEGER
    }, { timestamps: false })

    const Notification = sequelize.define('Notification', {
      titre: DataTypes.STRING,
      contenu: DataTypes.STRING,
      lu: DataTypes.BOOLEAN,
      date: DataTypes.DATE,
      Id_U: DataTypes.INTEGER
    }, { timestamps: false })

    const Proposer = sequelize.define('Proposer', {
      Id_S: DataTypes.INTEGER
    }, { timestamps: false })

    // Injection du modèle principal
    Signalement = defineSignalement(sequelize, DataTypes)
    Signalement.associate(sequelize.models)

    // Synchronisation
    await sequelize.sync({ force: true })

    // Données initiales
    await Utilisateur.create({ Id_U: 1, role: 'Encadrant', prenom: 'Jane', nom: 'Doe' })
    await Utilisateur.create({ Id_U: 2, role: 'Etudiant', prenom: 'John', nom: 'Smith' })
    await Etudiant.create({ CNE: 'E001', Id_U: 2 })
  })

  it('should create a signalement with default values', async () => {
    const s = await Signalement.create({
      description: 'Comportement inapproprié',
      Id_U: 1,
      CNE: 'E001'
    })

    expect(s).toBeDefined()
    expect(s.description).toBe('Comportement inapproprié')
    expect(s.count).toBe(1)
    expect(s.statut).toBe('En attente')
  })
})