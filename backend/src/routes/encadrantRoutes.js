import express from 'express';
import { authenticateUser } from '../middlewares/auth.js';
import { 
  getMonProfil,
  getFilieres,
  getFiliereEtudiants,
  getFiliereInformations,
  getGroupesAvecEtudiants,
  creerGroupeAvecEtudiants,
  modifierNom,
  supprimerEtudiants,
  ajouterEtudiants,
  afficherEtudiantsDansGroupe,
  afficherEtudiantsHorsGroupe,
} from '../controllers/encadrantController.js';

const router = express.Router();

// toutes les routes ici sont protégées
router.use(authenticateUser);


// Route pour voir son profil
router.get('/profil', getMonProfil);

// Route pour récupérer les filières enseignées par un encadrant
router.get('/encadrant/:numSum/filieres', getFilieres);

// Liste des étudiants par filière
router.get('/filieres/:idFiliere/etudiants', getFiliereEtudiants);

// Route pour obtenir les informations d'une filière
router.get('/:idFiliere/informations', getFiliereInformations);

// Voir les groupes créés par l'encadrant avec leurs étudiants
router.get('/groupes', getGroupesAvecEtudiants);

// Créer un groupe avec des étudiants
router.post('/groupes', creerGroupeAvecEtudiants);

router.put("/groupe/:idGroupe/nom", modifierNom);
router.delete("/groupe/:idGroupe/etudiants",supprimerEtudiants);
router.post("/groupe/:idGroupe/etudiants", ajouterEtudiants);
router.get("/groupe/:idGroupe/etudiants", afficherEtudiantsDansGroupe);
router.get("/groupe/:idGroupe/etudiants-hors/:idFiliere",afficherEtudiantsHorsGroupe);


export default router;
