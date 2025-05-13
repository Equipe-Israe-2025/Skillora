// services/utilisateurService.js
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import jwt from 'jsonwebtoken';
import sequelize from '../config/db.js';
import {
  Utilisateur,
  Tuteur,
  Etudiant,
  Encadrant
} from '../sync.js';


dotenv.config();

// Service pour mettre à jour l'image de profil de l'utilisateur
export const updateUserProfileImageService = async (userId, imagePath) => {
    try {
      // Mise à jour de l'utilisateur avec le nouveau chemin d'image
      const user = await Utilisateur.update(
        { image: imagePath },
        { where: { Id_U: userId } }
      );
  
      // Si l'utilisateur n'est pas trouvé
      if (!user[0]) {
        throw new Error('Utilisateur non trouvé');
      }
  
      return { message: 'Image de profil mise à jour avec succès', imagePath };
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la mise à jour de l\'image');
    }
};

export async function creerUtilisateurService({ nom, prenom, email, password, role, taux, Id_F, specialite, Num_sum, CNE }) {
  const t = await sequelize.transaction();

  try {
    const existing = await Utilisateur.findOne({ where: { email }, transaction: t });
    if (existing) throw new Error('Email déjà utilisé.');

    const utilisateur = await Utilisateur.create({
      nom,
      prenom,
      email,
      password,
      role,
      taux
    }, { transaction: t });

    if (role === 'Tuteur') {
      await Tuteur.create({ Id_U: utilisateur.Id_U, specialite }, { transaction: t });
    } else if (role === 'Encadrant') {
      await Encadrant.create({ Id_U: utilisateur.Id_U, Num_sum, specialite }, { transaction: t });
    } else if (role === 'Etudiant') {
      if (!CNE) throw new Error('Le champ CNE est obligatoire pour un Etudiant.');
      if (!Id_F) throw new Error('Le champ Id_F est obligatoire pour un Etudiant.');

      await Etudiant.create({
        CNE,
        Id_U: utilisateur.Id_U,
        Id_F
      }, { transaction: t });
    }

    await t.commit();
    return utilisateur ;

  } catch (error) {
    await t.rollback(); // annule tout si erreur
    throw new Error(error.message || "Erreur lors de la création de l'utilisateur.");
  }
}

export async function getAllUtilisateursService() {
  return await Utilisateur.findAll();
}

export async function getUtilisateurByIdService(id) {
  const user = await Utilisateur.findByPk(id);
  if (!user) throw new Error('Utilisateur non trouvé.');
  return user;
}

export async function updateUtilisateurService(id, { email, password, role, taux }) {
  const user = await Utilisateur.findByPk(id);
  if (!user) throw new Error('Utilisateur non trouvé.');

  if (email) user.email = email;
  if (password) user.password = await bcrypt.hash(password, 10);
  if (role) user.role = role;
  if (taux) user.taux = taux;

  await user.save();
  return user;
}

export async function deleteUtilisateurService(id) {
  const deleted = await Utilisateur.destroy({ where: { Id_U: id } });
  if (!deleted) throw new Error('Utilisateur non trouvé.');
  return deleted;
}

export async function authenticateUserService({ email, password, role }) {
  
  const user = await Utilisateur.findOne({ where: { email, role } });

  if (!user) {
    throw new Error('Utilisateur non trouvé ou rôle incorrect');
  }

  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Mot de passe incorrect');
  }

 
  const token = jwt.sign(
    { id: user.Id_U, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user };
}

export async function logoutUserService() {
  return { message: 'Déconnexion réussie.' };
}

