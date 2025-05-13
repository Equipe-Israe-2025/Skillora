import express from 'express';
import {
  create,
  getAll,
  getById,
  update,
  removeComp,
} from '../controllers/CompetenceController.js';
import {
  authenticateUser,
  restrictToAdmin,
} from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authenticateUser);

router.post('/', restrictToAdmin, create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', restrictToAdmin, update);
router.delete('/:id', restrictToAdmin, removeComp);

export default router;
