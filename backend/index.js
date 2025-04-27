// index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './src/sync.js'; 
import encadrantRoutes from './src/routes/encadrantRoutes.js';
import etudiantRoutes from './src/routes/etudiantRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes

// Utilisation des routes utilisateur
app.use('/api/users', userRoutes);

// Servir les fichiers statiques dans le dossier 'uploads'
app.use('/uploads', express.static('uploads'));


app.use('/api/encadrants', encadrantRoutes);


app.use('/api/etudiant', etudiantRoutes);


// Vérification de la connexion à la base
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données :', error);
  }
})();

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
