import express from 'express';
import {
  register,
  login
} from '../controllers/adminController.js';


const router = express.Router();


//router.use(authenticateUser, authorizeRoles('Administrateur'));

router.post('/register', register);
router.post('/login', login);

export default router;
                                     