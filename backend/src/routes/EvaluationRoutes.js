import express from 'express';
import {
  createEvaluationController,
  getAllEvaluationsController,
  getEvaluationDetailsController,
  updateEvaluationController,
  deleteEvaluationController,
  getStudentEvaluationsController
} from '../controllers/evaluationController.js';

import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, createEvaluationController);
router.get('/', getAllEvaluationsController);
router.get('/:id', getEvaluationDetailsController);
router.put('/:id', updateEvaluationController);
router.delete('/:id', deleteEvaluationController);
router.get('/student/:CNE', getStudentEvaluationsController);

export default router;
