import { Utilisateur} from '../sync.js'

// Service pour mettre à jour l'image de profil de l'utilisateur
export const updateUserProfileImageService = async (userId, imagePath) => {
    try {
      // Mise à jour de l'utilisateur avec le nouveau chemin d'image
      const user = await Utilisateur.update(
        { image: imagePath },
        { where: { Id_U: userId } }
      );
  
      // Si l'utilisateur n'est pas trouvé
      if (!user[0]) {
        throw new Error('Utilisateur non trouvé');
      }
  
      return { message: 'Image de profil mise à jour avec succès', imagePath };
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la mise à jour de l\'image');
    }
  };
