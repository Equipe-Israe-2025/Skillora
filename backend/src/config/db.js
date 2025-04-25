import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Vérification des variables d'environnement
const requiredEnvVars = ['DB_NAME', 'DB_USERNAME', 'DB_PASSWORD', 'DB_HOST'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`❌ Variable manquante: ${envVar}`);
  }
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  }
);

// Test de connexion immédiat
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connecté à PostgreSQL');
  } catch (error) {
    console.error('❌ Échec de connexion:', error);
    process.exit(1);
  }
})();

export default sequelize;