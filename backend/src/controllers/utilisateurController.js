// controllers/utilisateurController.js
import {
    creerUtilisateurService,
    getAllUtilisateursService,
    getUtilisateurByIdService,
    updateUtilisateurService,
    deleteUtilisateurService,
    updateUserProfileImageService,
    authenticateUserService
  } from '../services/utilisateurService.js';


  
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


  
  export async function creerUtilisateur(req, res) {
    try {
      const utilisateur = await creerUtilisateurService(req.body);
      res.status(201).json({ message: 'Utilisateur créé avec succès.', utilisateur });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  export async function getAllUtilisateurs(req, res) {
    try {
      const users = await getAllUtilisateursService();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  export async function getUtilisateurById(req, res) {
    try {
      const user = await getUtilisateurByIdService(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  export async function updateUtilisateur(req, res) {
    try {
      const user = await updateUtilisateurService(req.params.id, req.body);
      res.status(200).json({ message: 'Utilisateur mis à jour avec succès.', user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  export async function deleteUtilisateur(req, res) {
    try {
      await deleteUtilisateurService(req.params.id);
      res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  export async function loginUtilisateur(req, res) {
    const { email, password, role } = req.body;
  
    try {
      const { token, user } = await authenticateUserService({ email, password, role });
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
  
  
  export async function logoutUtilisateur(req, res) {
    try {
      const result = await logoutUserService(); 
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }
  }