import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Sequelize, DataTypes, ForeignKeyConstraintError } from 'sequelize';
import ProposerModel from './Proposer';

describe('Proposer Model', () => {
  let sequelize;
  let Proposer, Signalement, Solution_Proposee;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });

    // Définir les modèles liés
    Signalement = sequelize.define('Signalement', {
      Id_S: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      titre: DataTypes.STRING
    }, {
      tableName: 'Signalement',
      timestamps: false
    });

    Solution_Proposee = sequelize.define('Solution_Proposee', {
      Id_SP: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      contenu: DataTypes.TEXT
    }, {
      tableName: 'Solution_Proposee',
      timestamps: false
    });

    Proposer = ProposerModel(sequelize, DataTypes);

    if (Proposer.associate) {
      Proposer.associate({ Signalement, Solution_Proposee });
    }

    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Proposer.destroy({ where: {}, truncate: true });
    await Solution_Proposee.destroy({ where: {}, truncate: true });
    await Signalement.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer une relation valide entre signalement et solution', async () => {
    const signalement = await Signalement.create({ titre: 'Erreur d\'affichage' });
    const solution = await Solution_Proposee.create({ contenu: 'Rafraîchir la page' });

    const lien = await Proposer.create({
      Id_S: signalement.Id_S,
      Id_SP: solution.Id_SP
    });

    expect(lien.Id_S).toBe(signalement.Id_S);
    expect(lien.Id_SP).toBe(solution.Id_SP);
  });

  it('devrait rejeter la création si Signalement n\'existe pas', async () => {
    const solution = await Solution_Proposee.create({ contenu: 'Nettoyer le cache' });

    await expect(Proposer.create({
      Id_S: 9999, // inexistant
      Id_SP: solution.Id_SP
    })).rejects.toThrow(ForeignKeyConstraintError);
  });

  it('devrait rejeter la création si Solution_Proposee n\'existe pas', async () => {
    const signalement = await Signalement.create({ titre: 'Lien mort' });

    await expect(Proposer.create({
      Id_S: signalement.Id_S,
      Id_SP: 9999 // inexistant
    })).rejects.toThrow(ForeignKeyConstraintError);
  });
});
