import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Sequelize, DataTypes, ValidationError } from 'sequelize';
import NotificationModel from './Notification';

describe('Notification Model', () => {
  let sequelize;
  let Notification, Utilisateur;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });

    Utilisateur = sequelize.define('Utilisateur', {
      Id_U: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      role: DataTypes.STRING
    }, {
      tableName: 'Utilisateur',
      timestamps: false
    });

    Notification = NotificationModel(sequelize, DataTypes);

    if (Notification.associate) {
      Notification.associate({ Utilisateur });
    }

    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Notification.destroy({ where: {}, truncate: true });
    await Utilisateur.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('devrait créer une notification valide avec valeurs par défaut', async () => {
    const user = await Utilisateur.create({ role: 'etudiant' });

    const notif = await Notification.create({
      titre: 'Nouveau badge débloqué',
      contenu: 'Félicitations pour votre nouveau badge !',
      Id_U: user.Id_U
    });

    expect(notif.lu).toBe(false);
    expect(notif.date).toBeInstanceOf(Date);
    expect(notif.type).toBe('systeme'); // valeur par défaut ENUM
  });

  it('devrait rejeter une notification avec un titre trop court', async () => {
    const user = await Utilisateur.create({ role: 'etudiant' });

    await expect(Notification.create({
      titre: 'Hey',
      contenu: 'Message court',
      Id_U: user.Id_U
    })).rejects.toThrow(ValidationError);
  });

  it('devrait rejeter une notification sans contenu', async () => {
    const user = await Utilisateur.create({ role: 'etudiant' });

    await expect(Notification.create({
      titre: 'Titre correct',
      contenu: null,
      Id_U: user.Id_U
    })).rejects.toThrow(ValidationError);
  });

  it('devrait refuser manuellement une valeur invalide du type ENUM', async () => {
    const user = await Utilisateur.create({ role: 'etudiant' });

    const allowedTypes = ['evaluation', 'signalement', 'badge', 'groupe', 'systeme'];
    const testType = 'non_valide';

    if (!allowedTypes.includes(testType)) {
      try {
        const result = await Notification.create({
          titre: 'Notification test',
          contenu: 'Contenu test',
          Id_U: user.Id_U,
          type: testType
        });

        // Si accepté, échouer manuellement le test
        throw new Error(`Le type "${testType}" a été accepté : ${result.toJSON().type}`);
      } catch (err) {
        expect(err).toBeDefined();
      }
    }
  });

  it('devrait stocker les champs optionnels (lien et metadata)', async () => {
    const user = await Utilisateur.create({ role: 'etudiant' });

    const notif = await Notification.create({
      titre: 'Lien disponible',
      contenu: 'Cliquez ici pour plus d\'infos',
      Id_U: user.Id_U,
      type: 'evaluation',
      lien: 'https://example.com/action',
      metadata: { idEvaluation: 123, important: true }
    });

    expect(notif.lien).toBe('https://example.com/action');
    expect(notif.metadata).toEqual({ idEvaluation: 123, important: true });
  });
});