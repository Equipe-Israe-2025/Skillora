import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import jwt from 'jsonwebtoken';
import {Administrateur,
       Utilisateur
        } from '../sync.js';

dotenv.config(); 

export async function createAdmin({ nom, prenom, email, password, role }) {

  const nouvelUtilisateur = await Utilisateur.create({
    nom,
    prenom,
    email,
    password, // le hook beforeSave va le hacher
    role: role || 'Administrateur'
  });

  const nouvelAdmin = await Administrateur.create({
    Id_U: nouvelUtilisateur.Id_U
  });

  return {
    Utilisateur: nouvelUtilisateur,
    Administrateur: nouvelAdmin
  };
}

export async function authenticateAdmin({ email, password, role }) {
  // Trouver l'utilisateur par email et rôle
  const adminUtilisateur = await Utilisateur.findOne({
    where: { email, role: role },
    include: {
      model: Administrateur,
      as: 'Administrateur'
    }
  });

  if (!adminUtilisateur) {
    throw new Error('Utilisateur non trouvé ou rôle incorrect');
  }

  const isMatch = await bcrypt.compare(password, adminUtilisateur.password);
  if (!isMatch) {
    throw new Error('Mot de passe incorrect');
  }

  const token = jwt.sign(
    { id: adminUtilisateur.Id_U, role: adminUtilisateur.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, admin: adminUtilisateur };
}
