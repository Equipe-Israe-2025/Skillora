import { getProfilEncadrant,
   getFilieresByEncadrant,
   getEtudiantsByFiliere,getFiliereInfo , 
   getGroupesByEncadrant, createGroupeAvecEtudiants,
   modifierNomGroupe,
   supprimerEtudiantsDuGroupe,
   ajouterEtudiantsAuGroupe,
   getEtudiantsDansGroupe,
   getEtudiantsHorsGroupe,
  } from '../services/encadrantService.js';

export const getMonProfil = async (req, res) => {
    try {
      const userId = req.user.Id_U;  // récupère l'id de l'utilisateur connecté
      const role = req.user.role;
      const profil = await getProfilEncadrant(userId);
  
      res.json(profil);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
};

export const getFilieres = async (req, res) => {
    const { numSum } = req.user; // req.user injecté par le middleware auth après vérification du token

  
    try {
      const filieres = await getFilieresByEncadrant(numSum);
      res.status(200).json(filieres);
    } catch (error) {
      console.error('Erreur dans le controller getFilieres:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des filières.' });
    }
};

export const getFiliereEtudiants = async (req, res) => {
  const { idFiliere } = req.params;
  try {
    const etudiants = await getEtudiantsByFiliere(idFiliere);
    res.json(etudiants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Contrôleur pour récupérer les informations d'une filière
export const getFiliereInformations = async (req, res) => {
    const { idFiliere } = req.params;
    try {
      const filiere = await getFiliereInfo(idFiliere);
      if (!filiere) {
        return res.status(404).json({ message: 'Filière non trouvée' });
      }
      res.json(filiere);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const getGroupesAvecEtudiants = async (req, res) => {
  try {
    const numSum = req.user.encadrant?.Num_sum;
    if (!numSum) {
      return res.status(403).json({ message: "Accès réservé aux encadrants" });
    }

    const groupes = await getGroupesByEncadrant(numSum);
    res.json(groupes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const creerGroupeAvecEtudiants = async (req, res) => {
  try {
    const numSum = req.user.encadrant?.Num_sum;
    if (!numSum) {
      return res.status(403).json({ message: "Accès réservé aux encadrants" });
    }

    const { idGroupe, cneList } = req.body;

    if (!idGroupe || !cneList?.length) {
      return res.status(400).json({ message: "Veuillez fournir un idGroupe et une liste d'étudiants (cneList)" });
    }

    await createGroupeAvecEtudiants(numSum, idGroupe, cneList);
    res.status(201).json({ message: "Groupe créé avec succès !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const modifierNom = async (req, res) => {
  const { idGroupe } = req.params;
  const { nouveauNom } = req.body;
  
  await groupeService.modifierNomGroupe(idGroupe, nouveauNom);
  res.status(200).json({ message: "Nom du groupe modifié avec succès." });
};

export const supprimerEtudiants = async (req, res) => {
  const { idGroupe } = req.params;
  const { listeCNE } = req.body;
  
  await groupeService.supprimerEtudiantsDuGroupe(idGroupe, listeCNE);
  res.status(200).json({ message: "Étudiants supprimés du groupe." });
};

export const ajouterEtudiants = async (req, res) => {
  const { idGroupe } = req.params;
  const { listeCNE, numSomme } = req.body;
  
  await groupeService.ajouterEtudiantsAuGroupe(idGroupe, listeCNE, numSomme);
  res.status(200).json({ message: "Étudiants ajoutés au groupe." });
};

export const afficherEtudiantsDansGroupe = async (req, res) => {
  const { idGroupe } = req.params;
  
  const etudiants = await groupeService.getEtudiantsDansGroupe(idGroupe);
  res.status(200).json(etudiants);
};

export const afficherEtudiantsHorsGroupe = async (req, res) => {
  const { idGroupe, idFiliere } = req.params;
  
  const etudiants = await groupeService.getEtudiantsHorsGroupe(idGroupe, idFiliere);
  res.status(200).json(etudiants);
};