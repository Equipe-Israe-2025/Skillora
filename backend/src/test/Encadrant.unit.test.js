import { describe, it, expect, beforeAll } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import EncadrantModel from './Encadrant.js';

describe('Modèle Encadrant', () => {
  let sequelize;
  let Encadrant;
  let Utilisateur, Forme, Enseigne;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });

    // Créer les modèles requis pour les associations
    Utilisateur = sequelize.define('Utilisateur', {
      Id_U: {
        type: DataTypes.INTEGER,
        primaryKey: true
      }
    });

    Forme = sequelize.define('Forme', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    });

    Enseigne = sequelize.define('Enseigne', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    });

    // Créer Encadrant
    Encadrant = EncadrantModel(sequelize, DataTypes);

    // Définir les associations
    Encadrant.associate({ Utilisateur, Forme, Enseigne });

    // Synchronisation de tous les modèles
    await sequelize.sync({ force: true });
  });

  it('doit définir correctement les attributs', async () => {
    const attributes = Encadrant.rawAttributes;

    expect(attributes.Num_sum).toBeDefined();
    expect(attributes.Num_sum.primaryKey).toBe(true);
    expect(attributes.Num_sum.type.constructor.name).toBe('STRING');

    expect(attributes.specialite).toBeDefined();
    expect(attributes.specialite.type.constructor.name).toBe('STRING');

    expect(attributes.Id_U).toBeDefined();
    expect(attributes.Id_U.allowNull).toBe(false);
    expect(attributes.Id_U.references.model).toBe('Utilisateur');
    expect(attributes.Id_U.references.key).toBe('Id_U');
  });

  it('doit avoir les associations correctes', () => {
    expect(Encadrant.associations.utilisateur).toBeDefined();
    expect(Encadrant.associations.utilisateur.associationType).toBe('BelongsTo');
    expect(Encadrant.associations.utilisateur.foreignKey).toBe('Id_U');

    expect(Encadrant.associations.forme).toBeDefined();
    expect(Encadrant.associations.forme.associationType).toBe('HasMany');
    expect(Encadrant.associations.forme.foreignKey).toBe('Num_sum');

    expect(Encadrant.associations.enseigne).toBeDefined();
    expect(Encadrant.associations.enseigne.associationType).toBe('HasMany');
    expect(Encadrant.associations.enseigne.foreignKey).toBe('Num_sum');
  });

  it('doit avoir le bon nom de table et options', () => {
    expect(Encadrant.getTableName()).toBe('Encadrant');
    expect(Encadrant.options.timestamps).toBe(false);
  });
});
