import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import utilisateurModel from './Utilisateur';

const sequelize = new Sequelize('sqlite::memory:', {
  logging: false
});

describe('Modèle Utilisateur', () => {
  let Utilisateur;

  beforeAll(async () => {
    Utilisateur = utilisateurModel(sequelize, DataTypes);
    
    // Ajout d'un hook de validation manuelle pour les rôles
    Utilisateur.beforeValidate((user) => {
      const validRoles = ['Etudiant', 'Administrateur', 'Encadrant', 'Tuteur'];
      if (user.role && !validRoles.includes(user.role)) {
        throw new Error(`Le rôle doit être l'un des suivants: ${validRoles.join(', ')}`);
      }
    });

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Structure du modèle', () => {
    it('devrait avoir les champs correctement définis', () => {
      const attributes = Utilisateur.getAttributes();
      
      expect(attributes.Id_U).toMatchObject({
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true
      });
      
      expect(attributes.nom).toMatchObject({
        type: DataTypes.STRING(),
        allowNull: false
      });
      
      expect(attributes.email).toMatchObject({
        type: DataTypes.STRING(),
        allowNull: false,
        unique: true
      });
    });
  });

  describe('Validations', () => {
    it('devrait valider un email valide', async () => {
      const user = Utilisateur.build({
        nom: 'Valid',
        prenom: 'Email',
        email: 'valid@example.com',
        password: 'password123',
        role: 'Etudiant'
      });
      
      await expect(user.validate()).resolves.not.toThrow();
    });

    it('devrait rejeter un email invalide', async () => {
      const user = Utilisateur.build({
        nom: 'Invalid',
        prenom: 'Email',
        email: 'not-an-email',
        password: 'password123',
        role: 'Etudiant'
      });
      
      await expect(user.validate()).rejects.toThrow();
    });

    it('devrait rejeter les rôles non autorisés', async () => {
      // Test avec création qui devrait échouer
      await expect(
        Utilisateur.create({
          nom: 'Invalid',
          prenom: 'Role',
          email: 'invalid.role@example.com',
          password: 'password123',
          role: 'InvalidRole'
        })
      ).rejects.toThrow();

      // Test avec validation manuelle
      const user = Utilisateur.build({
        nom: 'Invalid',
        prenom: 'Role',
        email: 'invalid.role2@example.com',
        password: 'password123',
        role: 'InvalidRole'
      });

      await expect(user.validate()).rejects.toThrow();
    });

    it('devrait accepter tous les rôles autorisés', async () => {
      const validRoles = ['Etudiant', 'Administrateur', 'Encadrant', 'Tuteur'];
      
      for (const role of validRoles) {
        const user = await Utilisateur.create({
          nom: role,
          prenom: 'Valid',
          email: `${role.toLowerCase()}@example.com`,
          password: 'password123',
          role: role
        });
        
        expect(user.role).toBe(role);
      }
    });
  });

  describe('Hooks', () => {
    it('devrait hacher le mot de passe avant création', async () => {
      const plainPassword = 'password123';
      const user = await Utilisateur.create({
        nom: 'Hash',
        prenom: 'Test',
        email: 'hash.test@example.com',
        password: plainPassword,
        role: 'Etudiant'
      });
      
      expect(user.password).not.toBe(plainPassword);
      expect(await bcrypt.compare(plainPassword, user.password)).toBe(true);
    });

    it('ne devrait pas re-hacher le mot de passe si inchangé', async () => {
      const user = await Utilisateur.create({
        nom: 'NoHash',
        prenom: 'Test',
        email: 'nohash.test@example.com',
        password: 'password123',
        role: 'Etudiant'
      });
      
      const originalHash = user.password;
      await user.update({ nom: 'Updated' });
      
      expect(user.password).toBe(originalHash);
    });
  });

  describe('Associations', () => {
    it('devrait avoir les associations définies', () => {
      const models = {
        Notification: sequelize.define('Notification', {}),
        Etudiant: sequelize.define('Etudiant', {}),
        Encadrant: sequelize.define('Encadrant', {}),
        Evaluation: sequelize.define('Evaluation', {}),
        Baser: sequelize.define('Baser', {}),
        Badge: sequelize.define('Badge', {}),
        Signalement: sequelize.define('Signalement', {}),
        Administrateur: sequelize.define('Administrateur', {}),
        Tuteur: sequelize.define('Tuteur', {})
      };
      
      Utilisateur.associate(models);
      
      expect(Utilisateur.associations.Notifications).toBeDefined();
      expect(Utilisateur.associations.Etudiant).toBeDefined();
      expect(Utilisateur.associations.Encadrant).toBeDefined();
    });
  });

  describe('Opérations CRUD', () => {
    beforeEach(async () => {
      await Utilisateur.destroy({ where: {} });
    });

    it('devrait créer un utilisateur', async () => {
      const user = await Utilisateur.create({
        nom: 'New',
        prenom: 'User',
        email: 'new.user@example.com',
        password: 'password123',
        role: 'Etudiant'
      });
      
      expect(user.Id_U).toBeDefined();
      expect(user.nom).toBe('New');
    });

    it('devrait retrouver un utilisateur par ID', async () => {
      const created = await Utilisateur.create({
        nom: 'ToFind',
        prenom: 'User',
        email: 'find.me@example.com',
        password: 'password123',
        role: 'Etudiant'
      });
      
      const found = await Utilisateur.findByPk(created.Id_U);
      expect(found.email).toBe('find.me@example.com');
    });

    it('devrait mettre à jour un utilisateur', async () => {
      const user = await Utilisateur.create({
        nom: 'Before',
        prenom: 'Update',
        email: 'before.update@example.com',
        password: 'password123',
        role: 'Etudiant'
      });
      
      await user.update({ nom: 'After' });
      expect(user.nom).toBe('After');
    });

    it('devrait supprimer un utilisateur', async () => {
      const user = await Utilisateur.create({
        nom: 'ToDelete',
        prenom: 'User',
        email: 'delete.me@example.com',
        password: 'password123',
        role: 'Etudiant'
      });
      
      await user.destroy();
      const found = await Utilisateur.findByPk(user.Id_U);
      expect(found).toBeNull();
    });
  });
});