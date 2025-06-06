import { getEtudiantsParTuteur } from '../services/TuteurService.js';

export const afficherEtudiantsParTuteur = async (req, res) => {
  const idTuteur = req.params.id;
  try {
    const etudiants = await getEtudiantsParTuteur(idTuteur);
    res.status(200).json(etudiants);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
