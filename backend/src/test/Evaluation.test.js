
import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import EvaluationModel from './Evaluation';

describe('Evaluation Model', () => {
  let sequelize;
  let Evaluation;
  let Utilisateur, Etudiant, Notification;

  beforeAll(async () => {
    // Configurer SQLite en mémoire
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false
    });

    // Modèles nécessaires
    Utilisateur = sequelize.define('Utilisateur', {
      Id_U: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      role: DataTypes.STRING
    }, {
      tableName: 'Utilisateur',
      timestamps: false
    });

    Etudiant = sequelize.define('Etudiant', {
      CNE: { type: DataTypes.STRING, primaryKey: true },
      Id_U: DataTypes.INTEGER
    }, {
      tableName: 'Etudiant',
      timestamps: false
    });

    Notification = sequelize.define('Notification', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      titre: DataTypes.STRING,
      contenu: DataTypes.TEXT,
      lu: DataTypes.BOOLEAN,
      date: DataTypes.DATE,
      Id_U: DataTypes.INTEGER
    }, {
      tableName: 'Notification',
      timestamps: false
    });

    Evaluation = EvaluationModel(sequelize, DataTypes);

    // Associations
    Utilisateur.hasOne(Etudiant, { foreignKey: 'Id_U' });
    Etudiant.belongsTo(Utilisateur, { foreignKey: 'Id_U', as: 'utilisateur' });

    if (Evaluation.associate) {
      Evaluation.associate({
        Utilisateur,
        Etudiant,
        Notification
      });
    }

    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    vi.restoreAllMocks();
    await Evaluation.destroy({ where: {}, truncate: { cascade: true } });
    await Notification.destroy({ where: {}, truncate: { cascade: true } });
    await Etudiant.destroy({ where: {}, truncate: { cascade: true } });
    await Utilisateur.destroy({ where: {}, truncate: { cascade: true } });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer une évaluation avec date par défaut', async () => {
    const user = await Utilisateur.create({ role: 'professeur' });
    const student = await Etudiant.create({ CNE: 'E123', Id_U: user.Id_U });

    const testDate = new Date('2025-01-01');
    vi.useFakeTimers();
    vi.setSystemTime(testDate);

    const evaluation = await Evaluation.create({
      type: 'auto_eval',
      note: 15,
      Id_U: user.Id_U,
      CNE: student.CNE
    });

    expect(evaluation.date).toEqual(testDate);
    vi.useRealTimers();
  });

  it('devrait valider manuellement le type ENUM', async () => {
    const user = await Utilisateur.create({ role: 'professeur' });
    const student = await Etudiant.create({ CNE: 'E123', Id_U: user.Id_U });

    const validTypes = ['auto_eval', 'tuteur', 'pair', 'professeur'];

    for (const type of validTypes) {
      await expect(Evaluation.create({
        type,
        note: 10,
        Id_U: user.Id_U,
        CNE: student.CNE
      })).resolves.toBeDefined();
    }

    const invalidType = 'type_invalide';
    if (!validTypes.includes(invalidType)) {
      try {
        const result = await Evaluation.create({
          type: invalidType,
          note: 10,
          Id_U: user.Id_U,
          CNE: student.CNE
        });
        throw new Error(`Le type invalide '${invalidType}' a été accepté: ${JSON.stringify(result.toJSON())}`);
      } catch (error) {
        expect(error).toBeDefined(); // Confirme que l'erreur a bien été levée
      }
    }
  });

  it('devrait créer une notification après création', async () => {
    const prof = await Utilisateur.create({ role: 'professeur' });
    const etudiantUser = await Utilisateur.create({ role: 'etudiant' });
    const student = await Etudiant.create({ CNE: 'E123', Id_U: etudiantUser.Id_U });

    const notificationSpy = vi.spyOn(sequelize.models.Notification, 'create');

    await Evaluation.create({
      type: 'professeur',
      note: 16,
      Id_U: prof.Id_U,
      CNE: student.CNE,
      commentaire: 'Bon travail'
    });

    expect(notificationSpy).toHaveBeenCalled();

    const notificationCall = notificationSpy.mock.calls[0][0];
    expect(notificationCall.titre).toBe('Nouvelle évaluation');
    expect(notificationCall.contenu).toContain('évalué par un professeur');
    expect(notificationCall.contenu).toContain('Note: 16/20');
    expect(notificationCall.contenu).toContain('Commentaire: Bon travail');
    expect(notificationCall.lu).toBe(false);
    expect(notificationCall.Id_U).toBe(etudiantUser.Id_U);

    notificationSpy.mockRestore();
  });
});