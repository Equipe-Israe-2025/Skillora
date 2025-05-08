import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { 
  getMonProfil,
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

// Liste des étudiants par filière
router.get('/filieres/:idFiliere/etudiants', getFiliereEtudiants);

// Route pour obtenir les informations d'une filière
router.get('/:idFiliere/informations', getFiliereInformations);

// Voir les groupes créés par l'encadrant avec leurs étudiants
router.get('/groupes', getGroupesAvecEtudiants);

// Créer un groupe avec des étudiants
router.post('/groupes', creerGroupeAvecEtudiants);

router.put("/groupe/:idGroupe", modifierNom);
router.delete("/groupe/:idGroupe",supprimerEtudiants);
router.post("/groupe/:idGroupe", ajouterEtudiants);
router.get("/groupe/:idGroupe", afficherEtudiantsDansGroupe);
//router.get("/groupe/:idGroupe/:idFiliere",afficherEtudiantsHorsGroupe);


export default router;
