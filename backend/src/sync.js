import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = { sequelize, Sequelize: sequelize.Sequelize };

// Chargement des modèles
const modelFiles = (await readdir(path.join(__dirname, 'models')))
  .filter(file => file.endsWith('.js') && file !== 'sync.js');

// Liste des modèles dans l'ordre de dépendance
const modelLoadOrder = [
  'Utilisateur',
  'Etudiant',
  'Encadrant',
  'Filiere',
  'Groupe',
  'Forme',
  'Enseigne',
  'Administrateur',
  'Competence',
  'Indicateur',
  'Evaluation', // Doit être chargé avant Baser
  'Baser', // Doit être chargé après Evaluation
  'Tuteur',
  'Badge',
  'Proposer',
  'Solution_Proposee',
  'Notification',
  'Signalement'
];

// Chargement des modèles dans l'ordre spécifié
for (const modelName of modelLoadOrder) {
  const file = `${modelName}.js`;
  if (modelFiles.includes(file)) {
    try {
      const { default: modelInit } = await import(`./models/${file}`);
      const model = modelInit(sequelize, sequelize.Sequelize.DataTypes);
      db[model.name] = model;
    } catch (error) {
      console.error(`⚠️ Erreur de chargement du modèle ${file}:`, error);
    }
  }
}

// Configuration des associations
for (const modelName of Object.keys(db)) {
  if (typeof db[modelName].associate === 'function') {
    try {
      db[modelName].associate(db);
    } catch (error) {
      console.error(`⚠️ Erreur d'association pour ${modelName}:`, error);
    }
  }
}

// Synchronisation avec contrôle d'ordre
try {
  // Désactiver les contraintes temporairement
  await sequelize.query('SET CONSTRAINTS ALL DEFERRED');

  // Synchroniser dans un ordre spécifique
  await db.Utilisateur.sync({ alter: true });
  await db.Administrateur.sync({ alter: true });
  await db.Etudiant.sync({ alter: true });
  await db.Tuteur.sync({ alter: true });
  await db.Encadrant.sync({ alter: true });
  await db.Filiere.sync({ alter: true });
  await db.Groupe.sync({ alter: true });
  await db.Forme.sync({ alter: true });
  await db.Enseigne.sync({ alter: true });
  await db.Competence.sync({ alter: true });
  await db.Indicateur.sync({ alter: true });
  await db.Evaluation.sync({ alter: true }); // Important: avant Baser
  await db.Baser.sync({ alter: true }); // Doit être après Evaluation
  await db.Badge.sync({ alter: true });
  await db.Signalement.sync({ alter: true });
  await db.Solution_Proposee.sync({ alter: true });
  await db.Proposer.sync({ alter: true });
  await db.Notification.sync({ alter: true });
 

  console.log('✅ Base synchronisée avec succès');
  
  const [tables] = await sequelize.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
  console.log(' Tables créées:', tables.map(t => t.table_name).join(', '));
} catch (error) {
  console.error('❌ Erreur de synchronisation:', error);
  process.exit(1);
}

// Réactiver les contraintes
await sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');

export const Utilisateur = db.Utilisateur;
export const Encadrant = db.Encadrant;
export const Etudiant = db.Etudiant;
export const Forme = db.Forme;
export const Groupe = db.Groupe;
export const Enseigne = db.Enseigne;
export const Filiere = db.Filiere;
export const Administrateur = db.Administrateur;
export const Evaluation = db.Evaluation;
export const Tuteur = db.Tuteur;
export const Baser = db.Baser;
export const Competence = db.Competence;
export const Indicateur = db.Indicateur;
export const Badge = db.Badge;
export const Proposer = db.Proposer;
export const Solution_Proposee = db.Solution_Proposee;
export const Notification = db.Notification;
export const Signalement = db.Signalement;

export default db;