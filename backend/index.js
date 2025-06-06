import express from 'express';


import dotenv from 'dotenv';
import cors from 'cors';
import db from './src/sync.js'; 
import encadrantRoutes from './src/routes/encadrantRoutes.js';
import etudiantRoutes from './src/routes/etudiantRoutes.js';
import utilisateurRoutes from './src/routes/utilisateurRoutes.js';
import EvaluationRoutes from './src/routes/EvaluationRoutes.js';
import TuteurRoutes from './src/routes/TuteurRoutes.js';
import CompetenceRoutes from './src/routes/CompetenceRoutes.js';
import IndicateurRoutes from './src/routes/IndicateurRoutes.js';
import BadgeRoutes from './src/routes/BadgeRoutes.js';
import StatistiqueRoutes from './src/routes/StatistiqueRoutes.js';

import FiliereRoutes from './src/routes/FiliereRoutes.js';

import adminRoutes from './src/routes/adminRoutes.js';
import signalementRoutes from './src/routes/signalementRoutes.js';
import solutionRoutes from './src/routes/solutionRoutes.js';
import notificationRoutes from './src/routes/notificationRoute.js';
import EnseigneRoutes from './src/routes/EnseigneRoutes.js'; 
import authRoutes from './src/routes/authRoutes.js';



dotenv.config();


const app = express();

app.use(express.json());


const port = process.env.PORT || 3000;


app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));




// Servir les fichiers statiques dans le dossier 'uploads'
app.use('/uploads', express.static('uploads'));


app.use('/api/encadrants', encadrantRoutes);


app.use('/api/etudiant', etudiantRoutes);

app.use('/api/evaluations', EvaluationRoutes);
app.use('/api/competences', CompetenceRoutes);
app.use('/api/indicateurs', IndicateurRoutes);
app.use('/api/statistiques', StatistiqueRoutes);
app.use('/api/badges', BadgeRoutes);
app.use('/public', express.static('public')); //pour rendre le dossier pub accessible
app.use('/api/filieres', FiliereRoutes);
app.use('/api/tuteurs', TuteurRoutes);


app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/signalements', signalementRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/api/enseigne', EnseigneRoutes); 
app.use('/api/validate',authRoutes);

// Vérification de la connexion à la base
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connexion à la base de données réussie');
  } catch (error) {
    console.error('Erreur de connexion à la base de données :', error);
  }
})();



// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);

});
