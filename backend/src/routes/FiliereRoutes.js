import express from 'express';
import {
  create,
  update,
  supprimer
} from '../controllers/FiliereController.js';
import {
  authenticateUser,
  restrictToAdmin,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', restrictToAdmin, create);
router.put('/:id', restrictToAdmin, update);
router.delete('/:id', restrictToAdmin, supprimer);

export default router;
