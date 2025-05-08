import express from 'express';
import {
  assignerFilieres,
  recupererFilieresEncadrant,
  retirerFiliere
} from '../controllers/EnseigneController.js';

const router = express.Router();

router.post('/', assignerFilieres);
router.get('/:numSum', recupererFilieresEncadrant);
router.delete('/:numSum/:idFiliere', retirerFiliere);

export default router;