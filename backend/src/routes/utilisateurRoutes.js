import express from 'express';
import {
  creerUtilisateur,
  getAllUtilisateurs,
  getUtilisateurById,
  updateUtilisateur,
  deleteUtilisateur,
  updateUserProfileImage,
  loginUtilisateur, 
  logoutUtilisateur
} from '../controllers/utilisateurController.js';
import upload from '../config/multerConfig.js'; // Configuration multer

import {
  authenticateUser,
  authorizeRoles
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route pour l'upload de l'image de profil
router.post('/upload-profile-image', upload.single('image'), updateUserProfileImage);

//  Créer un utilisateur (seulement par un Administrateur)
router.post('/creer', authenticateUser, authorizeRoles('Administrateur'), creerUtilisateur);

//  Lire tous les utilisateurs (par admin uniquement)
//router.get('/', authenticateUser, authorizeRoles('Administrateur'), getAllUtilisateurs);
router.get('/', getAllUtilisateurs);
// Lire un utilisateur par ID (admin ou l'utilisateur lui-même)
router.get('/:id', authenticateUser, getUtilisateurById);

//  Modifier un utilisateur (admin ou l'utilisateur lui-même)
router.put('/:id', authenticateUser, updateUtilisateur);

// Supprimer un utilisateur (admin uniquement)
router.delete('/:id', authenticateUser, authorizeRoles('Administrateur'), deleteUtilisateur);

router.post('/login', loginUtilisateur);
router.post('/logout', authenticateUser, logoutUtilisateur);


export default router;
