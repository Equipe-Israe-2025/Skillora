// routes/authRoutes.js
import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateUser, (req, res) => {
  // Si le middleware passe, l’utilisateur est authentifié
  res.status(200).json({
    message: "Authentifié",
    user: req.user, // infos du token (comme l'id, le role, etc.)
  });
});

export default router;