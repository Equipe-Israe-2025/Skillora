import express from 'express';
import {
  getNotifications,
  deleteNotification
} from '../controllers/notificationController.js';

import {
  authenticateUser
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protéger toutes les routes avec authentification
router.use(authenticateUser);

// Routes accessibles à tous les utilisateurs connectés
router.get('/:userId', getNotifications);
router.delete('/:notificationId', deleteNotification);

export default router;
