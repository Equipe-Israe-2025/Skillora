// routes/statistiqueRoutes.js
import express from 'express';
import {
  moyenneParCompetenceController,
  rapportJSONController,
  rapportPDFController,
} from '../controllers/StatistiqueControllers.js';

const router = express.Router();

router.get('/moyennes', moyenneParCompetenceController); // ex: /api/statistiques/moyennes
router.get('/rapport/json', rapportJSONController);
router.get('/rapport/pdf', rapportPDFController);

export default router;
