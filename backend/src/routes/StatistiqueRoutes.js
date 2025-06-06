import express from 'express';
import {
  moyenneParCompetenceController,
  rapportJSONController,
  rapportPDFController,
  afficherEvolutionParCompetence,
} from '../controllers/StatistiqueControllers.js';

const router = express.Router();

router.get('/moyennes', moyenneParCompetenceController);
router.get('/rapport/json', rapportJSONController);
router.get('/rapport/pdf', rapportPDFController);
router.get('/competences/evolution', afficherEvolutionParCompetence);

export default router;
