import { getProfilEncadrant,
   getEtudiantsByFiliere,
   getFiliereInfo , 
   getGroupesByEncadrant, 
   getNumSumByUserId,
   createGroupeAvecEtudiants,
   modifierNomGroupe,
   supprimerEtudiantsDuGroupe,
   ajouterEtudiantsAuGroupe,
   getEtudiantsDansGroupe,
   //getEtudiantsHorsGroupe,
  } from '../services/encadrantService.js';

export const getMonProfil = async (req, res) => {
    try {
      const userId = req.user.id;  // récupère l'id de l'utilisateur connecté
      const profil = await getProfilEncadrant(userId);
  
      res.json(profil);
    } catch (error) {
      res.status(404).json({ message: error.message });
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
    const idUtilisateur = req.user.id;
    const numSum = await getNumSumByUserId(idUtilisateur);

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
    const idUtilisateur = req.user.id;
    const { nom_groupe, cneList } = req.body;

    console.log("Données reçues:", { nom_groupe, cneList }); // Log des données reçues

    if (!nom_groupe || !Array.isArray(cneList) || cneList.length === 0) {
      return res.status(400).json({ message: "Veuillez fournir un nom de groupe et une liste d'étudiants valide" });
    }

    const numSum = await getNumSumByUserId(idUtilisateur);
    console.log("NumSum récupéré:", numSum); // Log du numSum
    
    const result = await createGroupeAvecEtudiants(numSum, nom_groupe, cneList);
    res.status(201).json(result);
  } catch (error) {
    console.error("Erreur complète:", error); // Affiche l'erreur complète dans la console
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
export const modifierNom = async (req, res) => {
  const { idGroupe } = req.params;
  const { nouveauNom } = req.body;
  
  await modifierNomGroupe(idGroupe, nouveauNom);
  res.status(200).json({ message: "Nom du groupe modifié avec succès." });
};

export const supprimerEtudiants = async (req, res) => {
  const { idGroupe } = req.params;
  const { listeCNE } = req.body;
  
  await supprimerEtudiantsDuGroupe(idGroupe, listeCNE);
  res.status(200).json({ message: "Étudiants supprimés du groupe." });
};

export const ajouterEtudiants = async (req, res) => {
  const { idGroupe } = req.params;
  const idUtilisateur = req.user.id;
  const numSum = await getNumSumByUserId(idUtilisateur);
  const { listeCNE } = req.body;
  
  await ajouterEtudiantsAuGroupe(idGroupe, listeCNE, numSum);
  res.status(200).json({ message: "Étudiants ajoutés au groupe." });
};

export const afficherEtudiantsDansGroupe = async (req, res) => {
  const { idGroupe } = req.params;
  
  const etudiants = await getEtudiantsDansGroupe(idGroupe);
  res.status(200).json(etudiants);
};

/*export const afficherEtudiantsHorsGroupe = async (req, res) => {
  const { idGroupe, idFiliere } = req.params;
  
  const etudiants = await getEtudiantsHorsGroupe(idGroupe, idFiliere);
  res.status(200).json(etudiants);
};*/