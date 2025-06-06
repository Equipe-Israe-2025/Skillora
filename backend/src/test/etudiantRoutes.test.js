import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import etudiantRoutes from '../routes/etudiantRoutes.js';

// 🧪 Mocks des middlewares
vi.mock('../middlewares/auth.js', () => ({
  authenticateUser: (req, res, next) => {
    req.user = { Id_U: 123, role: 'Etudiant' }; // simulé
    next();
  },
  authorizeRoles: () => (req, res, next) => {
    next(); // simuler autorisation accordée
  }
}));

// 🧪 Mocks des contrôleurs
vi.mock('../controllers/etudiantController.js', () => ({
  afficherProfilEtudiant: vi.fn((req, res) => {
    res.status(200).json({ nom: 'Test Etudiant', id: req.user.Id_U });
  }),
  afficherMesGroupes: vi.fn((req, res) => {
    res.status(200).json([{ id: 1, nom: 'Groupe 1' }]);
  }),
  afficherDetailsGroupe: vi.fn((req, res) => {
    res.status(200).json({ id: req.params.groupeId, nom: 'Groupe Détail' });
  }),
}));

// 🔧 App Express pour les tests
const app = express();
app.use(express.json());
app.use('/etudiant', etudiantRoutes);

// ✅ TESTS
describe('Routes Etudiant', () => {
  it('GET /etudiant/profil-etudiant retourne les infos du profil', async () => {
    const res = await request(app).get('/etudiant/profil-etudiant');
    expect(res.status).toBe(200);
    expect(res.body.nom).toBe('Test Etudiant');
  });

  it('GET /etudiant/mes-groupes retourne les groupes de l’étudiant', async () => {
    const res = await request(app).get('/etudiant/mes-groupes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].nom).toBe('Groupe 1');
  });

  it('GET /etudiant/mes-groupes/:groupeId retourne les détails d’un groupe', async () => {
    const res = await request(app).get('/etudiant/mes-groupes/45');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('45');
  });
});
