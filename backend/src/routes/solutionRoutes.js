import express from 'express';
import {
  createSolution,
  getAllSolutions,
  deleteSolution
} from '../controllers/solutionController.js';

import {
  authenticateUser,
  authorizeRoles
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(authenticateUser);

// Créer une solution — réservé aux E Administrateurs
router.post('/', authorizeRoles('Administrateur'), createSolution);

// Consulter toutes les solutions — accessible à tous les rôles authentifiés
router.get('/', getAllSolutions);

// Supprimer une solution — réservé aux Administrateurs
router.delete('/:id', authorizeRoles('Administrateur'), deleteSolution);

export default router;
