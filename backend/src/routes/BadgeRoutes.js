import express from 'express';
import {
  generateBadge,
  getBadgeByEvaluation,
  downloadBadge,
} from '../controllers/BadgeController.js';
import {
  authenticateUser,
  authorizeRoles,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser, authorizeRoles('etudiant'));

router.post('/:evaluationId/generate', generateBadge);
router.get('/:evaluationId', getBadgeByEvaluation);
router.get('/:badgeId/download', downloadBadge);

export default router;
