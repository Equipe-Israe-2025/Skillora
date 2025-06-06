import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock des contrôleurs
const mockControllers = {
  getMonProfil: vi.fn((req, res) => res.sendStatus(200)),
  getFilieres: vi.fn((req, res) => res.sendStatus(200)),
  getFiliereEtudiants: vi.fn((req, res) => res.sendStatus(200)),
  getFiliereInformations: vi.fn((req, res) => res.sendStatus(200)),
  getGroupesAvecEtudiants: vi.fn((req, res) => res.sendStatus(200)),
  creerGroupeAvecEtudiants: vi.fn((req, res) => res.status(201).send({})),
  modifierNom: vi.fn((req, res) => res.sendStatus(200)),
  supprimerEtudiants: vi.fn((req, res) => res.sendStatus(200)),
  ajouterEtudiants: vi.fn((req, res) => res.status(201).send({})),
  afficherEtudiantsDansGroupe: vi.fn((req, res) => res.sendStatus(200)),
  afficherEtudiantsHorsGroupe: vi.fn((req, res) => res.sendStatus(200)),
};

// Mock du middleware d'authentification
const mockAuthMiddleware = vi.fn((req, res, next) => next());

// Configuration des mocks
vi.mock('../controllers/encadrantController.js', () => ({
  ...mockControllers,
  getFiliereInformations: mockControllers.getFiliereInformations, // Correction du nom
}));

vi.mock('../middlewares/auth.js', () => ({
  authenticateUser: mockAuthMiddleware,
}));

describe('Encadrant Routes', () => {
  let app;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    
    // Import dynamique après configuration des mocks
    const router = (await import('./encadrantRoutes.js')).default;
    app.use('/api', router);
  });

//   it('should apply authentication middleware to all routes', () => {
//     expect(mockAuthMiddleware).toHaveBeenCalled();
//   });

  describe('Profil Routes', () => {
    it('GET /profil - should call getMonProfil', async () => {
      const response = await request(app).get('/api/profil');
      expect(response.status).toBe(200);
      expect(mockControllers.getMonProfil).toHaveBeenCalled();
      expect(mockAuthMiddleware).toHaveBeenCalled();
    });
  });

  describe('Filière Routes', () => {
    it('GET /encadrant/:numSum/filieres - should call getFilieres', async () => {
      const numSum = '12345';
      const response = await request(app).get(`/api/encadrant/${numSum}/filieres`);
      expect(response.status).toBe(200);
      expect(mockControllers.getFilieres).toHaveBeenCalled();
    });

    it('GET /filieres/:idFiliere/etudiants - should call getFiliereEtudiants', async () => {
      const idFiliere = '1';
      const response = await request(app).get(`/api/filieres/${idFiliere}/etudiants`);
      expect(response.status).toBe(200);
      expect(mockControllers.getFiliereEtudiants).toHaveBeenCalled();
    });

    it('GET /:idFiliere/informations - should call getFiliereInformations', async () => {
      const idFiliere = '1';
      const response = await request(app).get(`/api/${idFiliere}/informations`);
      expect(response.status).toBe(200);
      expect(mockControllers.getFiliereInformations).toHaveBeenCalled();
    });
  });

  describe('Groupe Routes', () => {
    it('GET /groupes - should call getGroupesAvecEtudiants', async () => {
      const response = await request(app).get('/api/groupes');
      expect(response.status).toBe(200);
      expect(mockControllers.getGroupesAvecEtudiants).toHaveBeenCalled();
    });

    it('POST /groupes - should call creerGroupeAvecEtudiants', async () => {
      const newGroup = { nom: 'Groupe A', etudiants: [1, 2, 3] };
      const response = await request(app)
        .post('/api/groupes')
        .send(newGroup);
      expect(response.status).toBe(201);
      expect(mockControllers.creerGroupeAvecEtudiants).toHaveBeenCalled();
    });

    it('PUT /groupe/:idGroupe/nom - should call modifierNom', async () => {
      const idGroupe = '1';
      const newName = { nom: 'Nouveau nom' };
      const response = await request(app)
        .put(`/api/groupe/${idGroupe}/nom`)
        .send(newName);
      expect(response.status).toBe(200);
      expect(mockControllers.modifierNom).toHaveBeenCalled();
    });

    it('DELETE /groupe/:idGroupe/etudiants - should call supprimerEtudiants', async () => {
      const idGroupe = '1';
      const studentsToRemove = { etudiants: [1, 2] };
      const response = await request(app)
        .delete(`/api/groupe/${idGroupe}/etudiants`)
        .send(studentsToRemove);
      expect(response.status).toBe(200);
      expect(mockControllers.supprimerEtudiants).toHaveBeenCalled();
    });

    it('POST /groupe/:idGroupe/etudiants - should call ajouterEtudiants', async () => {
      const idGroupe = '1';
      const newStudents = { etudiants: [4, 5] };
      const response = await request(app)
        .post(`/api/groupe/${idGroupe}/etudiants`)
        .send(newStudents);
      expect(response.status).toBe(201);
      expect(mockControllers.ajouterEtudiants).toHaveBeenCalled();
    });

    it('GET /groupe/:idGroupe/etudiants - should call afficherEtudiantsDansGroupe', async () => {
      const idGroupe = '1';
      const response = await request(app).get(`/api/groupe/${idGroupe}/etudiants`);
      expect(response.status).toBe(200);
      expect(mockControllers.afficherEtudiantsDansGroupe).toHaveBeenCalled();
    });

    it('GET /groupe/:idGroupe/etudiants-hors/:idFiliere - should call afficherEtudiantsHorsGroupe', async () => {
      const idGroupe = '1';
      const idFiliere = '2';
      const response = await request(app).get(`/api/groupe/${idGroupe}/etudiants-hors/${idFiliere}`);
      expect(response.status).toBe(200);
      expect(mockControllers.afficherEtudiantsHorsGroupe).toHaveBeenCalled();
    });
  });
});