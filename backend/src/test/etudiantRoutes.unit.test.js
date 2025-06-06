import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock des contrôleurs
const mockControllers = {
  afficherProfilEtudiant: vi.fn((req, res) => {
    res.status(200).json({ nom: 'Test Etudiant', id: req.user.Id_U });
  }),
  afficherMesGroupes: vi.fn((req, res) => {
    res.status(200).json([{ id: 1, nom: 'Groupe 1' }]);
  }),
  afficherDetailsGroupe: vi.fn((req, res) => {
    res.status(200).json({ id: req.params.groupeId, nom: 'Groupe Détail' });
  }),
};

// Mock des middlewares
const mockAuthMiddleware = {
  authenticateUser: vi.fn((req, res, next) => {
    req.user = { Id_U: 123, role: 'Etudiant' };
    next();
  }),
  authorizeRoles: vi.fn(() => (req, res, next) => {
    next();
  }),
};

// Configuration des mocks
vi.mock('../controllers/etudiantController.js', () => mockControllers);
vi.mock('../middlewares/auth.js', () => mockAuthMiddleware);

describe('Etudiant Routes', () => {
  let app;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    
    // Import dynamique après configuration des mocks
    const router = (await import('../routes/etudiantRoutes.js')).default;
    app.use('/etudiant', router);
  });

  it('should apply authentication and authorization middlewares to all routes', async () => {
    await request(app).get('/etudiant/profil-etudiant');
    expect(mockAuthMiddleware.authenticateUser).toHaveBeenCalled();
    expect(mockAuthMiddleware.authorizeRoles).toHaveBeenCalledWith('Etudiant');
  });

  describe('GET /profil-etudiant', () => {
    it('should call afficherProfilEtudiant with user data', async () => {
      const response = await request(app).get('/etudiant/profil-etudiant');
      
      expect(response.status).toBe(200);
      expect(mockControllers.afficherProfilEtudiant).toHaveBeenCalled();
      expect(response.body).toEqual({
        nom: 'Test Etudiant',
        id: 123 // Vérifie que l'ID vient bien du mock du middleware
      });
    });
  });

  describe('GET /mes-groupes', () => {
    it('should call afficherMesGroupes and return groups array', async () => {
      const response = await request(app).get('/etudiant/mes-groupes');
      
      expect(response.status).toBe(200);
      expect(mockControllers.afficherMesGroupes).toHaveBeenCalled();
      expect(response.body).toEqual([{ id: 1, nom: 'Groupe 1' }]);
    });
  });

  describe('GET /mes-groupes/:groupeId', () => {
    it('should call afficherDetailsGroupe with correct params', async () => {
      const groupeId = '45';
      const response = await request(app).get(`/etudiant/mes-groupes/${groupeId}`);
      
      expect(response.status).toBe(200);
      expect(mockControllers.afficherDetailsGroupe).toHaveBeenCalled();
      expect(response.body).toEqual({
        id: groupeId,
        nom: 'Groupe Détail'
      });
      
      // Vérifie que le paramètre est bien passé
      const mockCall = mockControllers.afficherDetailsGroupe.mock.calls[0][0];
      expect(mockCall.params.groupeId).toBe(groupeId);
    });

    it('should return 404 for invalid groupeId', async () => {
      // Modifier le mock pour simuler un groupe non trouvé
      mockControllers.afficherDetailsGroupe.mockImplementationOnce((req, res) => {
        res.status(404).json({ message: 'Groupe non trouvé' });
      });
      
      const response = await request(app).get('/etudiant/mes-groupes/invalid');
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Groupe non trouvé' });
    });
  });
});