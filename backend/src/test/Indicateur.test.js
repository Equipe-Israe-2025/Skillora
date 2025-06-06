import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Sequelize, DataTypes, ValidationError, ForeignKeyConstraintError } from 'sequelize';
import IndicateurModel from './Indicateur';

describe('Indicateur Model', () => {
  let sequelize;
  let Indicateur, Competence, Baser;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });

    // Définition de Competence (clé étrangère)
    Competence = sequelize.define('Competence', {
      Id_C: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      nom: DataTypes.STRING
    }, {
      tableName: 'Competence',
      timestamps: false
    });

    // Définir modèle cible pour hasMany (Baser)
    Baser = sequelize.define('Baser', {
      Id_B: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Id_I: DataTypes.INTEGER,
      valeur: DataTypes.FLOAT
    }, {
      tableName: 'Baser',
      timestamps: false
    });

    // Initialiser Indicateur
    Indicateur = IndicateurModel(sequelize, DataTypes);

    if (Indicateur.associate) {
      Indicateur.associate({ Competence, Baser });
    }

    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Baser.destroy({ where: {}, truncate: true });
    await Indicateur.destroy({ where: {}, truncate: true });
    await Competence.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer un indicateur valide', async () => {
    const competence = await Competence.create({ Id_C: 'COMP01', nom: 'Travail en équipe' });

    const indicateur = await Indicateur.create({
      libelle: 'Communication',
      description: 'Capacité à bien transmettre les idées',
      Id_C: competence.Id_C
    });

    expect(indicateur.Id_I).toBeDefined();
    expect(indicateur.note).toBe(0); // valeur par défaut
  });

  it('devrait rejeter si libelle est manquant', async () => {
    const competence = await Competence.create({ Id_C: 'COMP02', nom: 'Autonomie' });

    await expect(Indicateur.create({
      description: 'Test sans libelle',
      Id_C: competence.Id_C
    })).rejects.toThrow(ValidationError);
  });

  it('devrait rejeter si Id_C ne correspond à aucune compétence', async () => {
    await expect(Indicateur.create({
      libelle: 'Sens critique',
      description: 'Capacité à évaluer des idées',
      Id_C: 'INEXISTANT'
    })).rejects.toThrow(ForeignKeyConstraintError);
  });
});
