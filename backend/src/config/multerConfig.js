import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Pour résoudre le chemin du dossier 'uploads' avec ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de multer pour stocker les fichiers dans le dossier 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads')); // Définir le chemin du dossier de stockage
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ajouter un timestamp pour éviter les conflits de noms
  }
});

// Filtrage pour accepter seulement les fichiers image
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

// Limite de taille pour les fichiers
const limits = { fileSize: 5 * 1024 * 1024 }; // Limite de 5 Mo

// Création du middleware multer
const upload = multer({ storage, fileFilter, limits });

export default upload;
