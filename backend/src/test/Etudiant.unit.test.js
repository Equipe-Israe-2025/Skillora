import { describe, it, expect, beforeAll } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import EtudiantModel from './Etudiant.js';

describe('Modèle Etudiant', () => {
  let sequelize;
  let Etudiant;
  let Utilisateur, Filiere, Forme, Badge, Evaluation, Baser, Signalement;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });

    // Mock des modèles associés
    Utilisateur = sequelize.define('Utilisateur', {
      Id_U: {
        type: DataTypes.INTEGER,
        primaryKey: true
      }
    });

    Filiere = sequelize.define('Filiere', {
      Id_F: {
        type: DataTypes.STRING,
        primaryKey: true
      }
    });

    Forme = sequelize.define('Forme', {});
    Badge = sequelize.define('Badge', {});
    Evaluation = sequelize.define('Evaluation', {});
    Baser = sequelize.define('Baser', {});
    Signalement = sequelize.define('Signalement', {});

    Etudiant = EtudiantModel(sequelize, DataTypes);

    // Déclarer les associations
    Etudiant.associate({
      Utilisateur,
      Filiere,
      Forme,
      Badge,
      Evaluation,
      Baser,
      Signalement
    });

    await sequelize.sync({ force: true });
  });

  it('doit définir correctement les attributs', () => {
    const attrs = Etudiant.rawAttributes;

    expect(attrs.CNE).toBeDefined();
    expect(attrs.CNE.primaryKey).toBe(true);
    expect(attrs.CNE.validate.notEmpty).toBe(true);
    expect(attrs.CNE.validate.len).toEqual([6, 20]);

    expect(attrs.Id_U).toBeDefined();
    expect(attrs.Id_U.allowNull).toBe(false);
    expect(attrs.Id_U.references.model).toBe('Utilisateur');

    expect(attrs.Id_F).toBeDefined();
    expect(attrs.Id_F.allowNull).toBe(false);
    expect(attrs.Id_F.references.model).toBe('Filiere');
  });

  it('doit avoir les associations correctes', () => {
    expect(Etudiant.associations.utilisateur).toBeDefined();
    expect(Etudiant.associations.utilisateur.associationType).toBe('BelongsTo');
    expect(Etudiant.associations.utilisateur.foreignKey).toBe('Id_U');

    expect(Etudiant.associations.filiere).toBeDefined();
    expect(Etudiant.associations.filiere.associationType).toBe('BelongsTo');
    expect(Etudiant.associations.filiere.foreignKey).toBe('Id_F');

    for (const assoc of ['groupe', 'badge', 'evaluation', 'baser', 'signalement']) {
      expect(Etudiant.associations[assoc]).toBeDefined();
      expect(Etudiant.associations[assoc].associationType).toBe('HasMany');
      expect(Etudiant.associations[assoc].foreignKey).toBe('CNE');
    }
  });

  it('doit avoir le bon nom de table et options', () => {
    expect(Etudiant.getTableName()).toBe('Etudiant');
    expect(Etudiant.options.timestamps).toBe(false);
  });
});
