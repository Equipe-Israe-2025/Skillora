import express from 'express';
import {
  createSignalement,
  getAllSignalements,
  deleteSignalement
} from '../controllers/signalementController.js';

import {
  authenticateUser,
  authorizeRoles
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protéger toutes les routes par authentification
router.use(authenticateUser);

// Un étudiant, tuteur, encadrant ou admin peut créer un signalement
router.post('/', createSignalement);

// Seuls les administrateurs ou encadrants peuvent consulter tous les signalements
router.get('/', authorizeRoles('Encadrant','Etudiant', 'Administrateur'), getAllSignalements);

// Suppression réservée à l'administration
router.delete('/:id', authorizeRoles('Administrateur'), deleteSignalement);

export default router;
