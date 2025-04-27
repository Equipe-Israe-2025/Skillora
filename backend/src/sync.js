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

for (const file of modelFiles) {
  try {
    const { default: modelInit } = await import(`./models/${file}`);
    const model = modelInit(sequelize, sequelize.Sequelize.DataTypes);
    db[model.name] = model;
  } catch (error) {
    console.error(`⚠️ Erreur de chargement du modèle ${file}:`, error);
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

// Synchronisation
try {
  await sequelize.sync({ alter: true });
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

export const Utilisateur = db.Utilisateur;
export const Encadrant = db.Encadrant;
export const Etudiant = db.Etudiant;
export const Forme = db.Forme;
export const Groupe = db.Groupe;
export const Enseigne = db.Enseigne;
export const Filiere = db.Filiere;

export default db;