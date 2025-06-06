import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import CompetenceModel from './Competence.js';

describe('Modèle Competence', () => {
  let sequelize;
  let Competence;

  beforeAll(async () => {
    // Configuration de la base de données en mémoire
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
      define: {
        freezeTableName: true,
        timestamps: false
      }
    });

    // Initialisation du modèle
    Competence = CompetenceModel(sequelize, DataTypes);

    // Synchronisation
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('peut créer une compétence valide', async () => {
    const competence = await Competence.create({
      Id_C: 'COMP1',
      nom: 'Compétence Test',
      description: 'Description de la compétence'
    });

    expect(competence.Id_C).toBe('COMP1');
    expect(competence.nom).toBe('Compétence Test');
    expect(competence.description).toBe('Description de la compétence');
  });

  it('échoue si le nom est manquant', async () => {
    await expect(
      Competence.create({
        Id_C: 'COMP2'
        // nom manquant
      })
    ).rejects.toThrow();
  });

  it('peut créer une compétence sans description', async () => {
    const competence = await Competence.create({
      Id_C: 'COMP3',
      nom: 'Compétence Sans Description'
      // Pas de description
    });

    expect(competence.Id_C).toBe('COMP3');
    expect(competence.nom).toBe('Compétence Sans Description');
    expect(competence.description).toBeUndefined(); // 
  });

  
  it('peut créer une compétence avec description explicitement nulle', async () => {
    const competence = await Competence.create({
      Id_C: 'COMP4',
      nom: 'Compétence Description Nulle',
      description: null
    });

    expect(competence.Id_C).toBe('COMP4');
    expect(competence.nom).toBe('Compétence Description Nulle');
    expect(competence.description).toBeNull(); 
  });
});
