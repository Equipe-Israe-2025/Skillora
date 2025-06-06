// routes/etudiant.routes.js
import express from 'express';
import { afficherMesGroupes, afficherDetailsGroupe } from '../controllers/etudiantController.js';
import { authenticateUser, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRoles('Etudiant'));


// route pour voir tous ses groupes
router.get('/mes-groupes',  afficherMesGroupes);

// route pour voir détails d'un groupe
router.get('/mes-groupes/:groupeId', afficherDetailsGroupe);


export default router;
