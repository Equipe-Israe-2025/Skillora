import express from 'express';
import upload from '../config/multerConfig.js'; // Configuration multer
import { updateUserProfileImage } from '../controllers/userController.js';

const router = express.Router();

// Route pour l'upload de l'image de profil
router.post('/upload-profile-image', upload.single('image'), updateUserProfileImage);

export default router;
