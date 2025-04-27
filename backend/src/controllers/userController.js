import { updateUserProfileImageService } from '../services/userService.js';

// Fonction pour gérer l'upload et la mise à jour de l'image de profil
export const updateUserProfileImage = async (req, res) => {
  try {
    // Vérification que l'image a bien été téléchargée
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image téléchargée' });
    }

    const { userId } = req.body;  // Récupère l'ID de l'utilisateur dans le body de la requête

    // Chemin de l'image téléchargée
    const imagePath = `/uploads/${req.file.filename}`;

    // Appel au service pour mettre à jour l'image dans la base de données
    const result = await updateUserProfileImageService(userId, imagePath);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Erreur du serveur' });
  }
};
