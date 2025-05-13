// routes/indicateurRoutes.js
import { Router } from 'express';
import {
  create,
  getAll,
  getIndicateursByComp,
  update,
  supprimer,
} from '../controllers/IndicateurController.js';

import {
  authenticateUser,
  restrictToAdmin,
} from '../middlewares/authMiddleware.js';


const router = Router();

router.use(authenticateUser);

router.post('/', restrictToAdmin, create);
router.get('/', getAll);
router.get('/competence/:id', getIndicateursByComp);
router.put('/:id', restrictToAdmin, update);
router.delete('/:id', restrictToAdmin, supprimer);

export default router;
