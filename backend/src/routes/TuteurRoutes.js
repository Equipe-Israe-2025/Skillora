import express from 'express';
import { afficherEtudiantsParTuteur } from '../controllers/TuteurController.js';

const router = express.Router();

router.get('/:id', afficherEtudiantsParTuteur);

export default router;
