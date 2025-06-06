import { describe, it, expect, beforeAll } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import EnseigneModel from './Enseigne.js';

describe('Modèle Enseigne', () => {
  let sequelize;
  let Enseigne;
  let Encadrant, Groupe;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });

    // Définition des modèles associés nécessaires
    Encadrant = sequelize.define('Encadrant', {
      Num_sum: {
        type: DataTypes.STRING,
        primaryKey: true
      }
    });

    Groupe = sequelize.define('Groupe', {
      Id_G: {
        type: DataTypes.INTEGER,
        primaryKey: true
      }
    });

    // Création du modèle à tester
    Enseigne = EnseigneModel(sequelize, DataTypes);

    // Déclaration des associations
    Enseigne.associate({ Encadrant, Groupe });

    // Synchronisation
    await sequelize.sync({ force: true });
  });

  it('doit définir correctement les attributs', () => {
    const attrs = Enseigne.rawAttributes;

    expect(attrs.Num_sum).toBeDefined();
    expect(attrs.Num_sum.allowNull).toBe(false);
    expect(attrs.Num_sum.primaryKey).toBe(true);
    expect(attrs.Num_sum.references.model).toBe('Encadrant');
    expect(attrs.Num_sum.references.key).toBe('Num_sum');

    expect(attrs.Id_G).toBeDefined();
    expect(attrs.Id_G.allowNull).toBe(false);
    expect(attrs.Id_G.primaryKey).toBe(true);
    expect(attrs.Id_G.references.model).toBe('Groupe');
    expect(attrs.Id_G.references.key).toBe('Id_G');
  });

  it('doit avoir les associations correctes', () => {
    expect(Enseigne.associations.encadrant).toBeDefined();
    expect(Enseigne.associations.encadrant.associationType).toBe('BelongsTo');
    expect(Enseigne.associations.encadrant.foreignKey).toBe('Num_sum');

    expect(Enseigne.associations.groupe).toBeDefined();
    expect(Enseigne.associations.groupe.associationType).toBe('BelongsTo');
    expect(Enseigne.associations.groupe.foreignKey).toBe('Id_G');
  });

  it('doit avoir le bon nom de table et options', () => {
    expect(Enseigne.getTableName()).toBe('Enseigne');
    expect(Enseigne.options.timestamps).toBe(false);
  });
});
