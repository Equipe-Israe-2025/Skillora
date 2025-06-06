import express from 'express';
import {
  createEvaluationController,
  getAllEvaluationsController,
  getEvaluationDetailsController,
  updateEvaluationController,
  deleteEvaluationController,
  getStudentEvaluationsController,
  createOrUpdateEvaluationByCompetence,
  getEvaluatedCompetencesByEtudiant,
  updateEvaluationByCompetenceTuteur
} from '../controllers/EvaluationController.js';

import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, createEvaluationController);
router.get('/', getAllEvaluationsController);
router.get('/:id', getEvaluationDetailsController);
router.put('/:id', updateEvaluationController);
router.delete('/:id', deleteEvaluationController);
router.get('/student/:CNE', getStudentEvaluationsController);

///////////////route pour tuteur
router.get('/tuteur/:etudiantId', getEvaluatedCompetencesByEtudiant);
router.put('/tuteur/:etudiantId/competence/:competenceId',
  updateEvaluationByCompetenceTuteur,
);
router.post('/tuteur/:etudiantId/competence/:competenceId',
  createOrUpdateEvaluationByCompetence,
);

export default router;
