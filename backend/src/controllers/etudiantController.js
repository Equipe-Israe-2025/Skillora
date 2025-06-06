// controllers/etudiantController.js
import { getMesGroupes, getDetailsGroupe } from '../services/etudiantService.js';

export const afficherMesGroupes = async (req, res) => {
    try {
      const userId = req.user.Id_U;
      const groupes = await getMesGroupes(userId);
      res.status(200).json(groupes);
    } catch (error) {
      console.error('Erreur groupes:', error);
      res.status(500).json({ message: "Erreur serveur." });
    }
};
  
  export const afficherDetailsGroupe = async (req, res) => {
    try {
      const { groupeId } = req.params;
      const details = await getDetailsGroupe(groupeId);
      if (!details) {
        return res.status(404).json({ message: "Groupe non trouvé." });
      }
      res.status(200).json(details);
    } catch (error) {
      console.error('Erreur détails groupe:', error);
      res.status(500).json({ message: "Erreur serveur." });
    }
};