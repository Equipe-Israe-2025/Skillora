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
vi.mock('../controllers/encadrantController.js', () => mockControllers);
vi.mock('../middlewares/auth.js', () => ({ authenticateUser: mockAuthMiddleware }));

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

  it('should apply authentication middleware to all routes', async () => {
    await request(app).get('/api/profil');
    expect(mockAuthMiddleware).toHaveBeenCalled();
  });

  describe('Profil Routes', () => {
    it('GET /profil - should call getMonProfil', async () => {
      const response = await request(app).get('/api/profil');
      expect(response.status).toBe(200);
      expect(mockControllers.getMonProfil).toHaveBeenCalled();
    });
  });

  describe('Filière Routes', () => {
    it('GET /encadrant/:numSum/filieres - should call getFilieres with correct params', async () => {
      const numSum = '12345';
      const response = await request(app).get(`/api/encadrant/${numSum}/filieres`);
      expect(response.status).toBe(200);
      expect(mockControllers.getFilieres).toHaveBeenCalled();
      expect(mockControllers.getFilieres.mock.calls[0][0].params.numSum).toBe(numSum);
    });

    it('GET /filieres/:idFiliere/etudiants - should call getFiliereEtudiants with correct params', async () => {
      const idFiliere = '1';
      const response = await request(app).get(`/api/filieres/${idFiliere}/etudiants`);
      expect(response.status).toBe(200);
      expect(mockControllers.getFiliereEtudiants).toHaveBeenCalled();
      expect(mockControllers.getFiliereEtudiants.mock.calls[0][0].params.idFiliere).toBe(idFiliere);
    });

    it('GET /:idFiliere/informations - should call getFiliereInformations with correct params', async () => {
      const idFiliere = '1';
      const response = await request(app).get(`/api/${idFiliere}/informations`);
      expect(response.status).toBe(200);
      expect(mockControllers.getFiliereInformations).toHaveBeenCalled();
      expect(mockControllers.getFiliereInformations.mock.calls[0][0].params.idFiliere).toBe(idFiliere);
    });
  });

  describe('Groupe Routes', () => {
    it('GET /groupes - should call getGroupesAvecEtudiants', async () => {
      const response = await request(app).get('/api/groupes');
      expect(response.status).toBe(200);
      expect(mockControllers.getGroupesAvecEtudiants).toHaveBeenCalled();
    });

    it('POST /groupes - should call creerGroupeAvecEtudiants with request body', async () => {
      const newGroup = { nom: 'Groupe A', etudiants: [1, 2, 3] };
      const response = await request(app)
        .post('/api/groupes')
        .send(newGroup);
      expect(response.status).toBe(201);
      expect(mockControllers.creerGroupeAvecEtudiants).toHaveBeenCalled();
      expect(mockControllers.creerGroupeAvecEtudiants.mock.calls[0][0].body).toEqual(newGroup);
    });

    it('PUT /groupe/:idGroupe/nom - should call modifierNom with correct params and body', async () => {
      const idGroupe = '1';
      const newName = { nom: 'Nouveau nom' };
      const response = await request(app)
        .put(`/api/groupe/${idGroupe}/nom`)
        .send(newName);
      expect(response.status).toBe(200);
      expect(mockControllers.modifierNom).toHaveBeenCalled();
      expect(mockControllers.modifierNom.mock.calls[0][0].params.idGroupe).toBe(idGroupe);
      expect(mockControllers.modifierNom.mock.calls[0][0].body).toEqual(newName);
    });

    it('DELETE /groupe/:idGroupe/etudiants - should call supprimerEtudiants with correct params and body', async () => {
      const idGroupe = '1';
      const studentsToRemove = { etudiants: [1, 2] };
      const response = await request(app)
        .delete(`/api/groupe/${idGroupe}/etudiants`)
        .send(studentsToRemove);
      expect(response.status).toBe(200);
      expect(mockControllers.supprimerEtudiants).toHaveBeenCalled();
      expect(mockControllers.supprimerEtudiants.mock.calls[0][0].params.idGroupe).toBe(idGroupe);
      expect(mockControllers.supprimerEtudiants.mock.calls[0][0].body).toEqual(studentsToRemove);
    });

    it('POST /groupe/:idGroupe/etudiants - should call ajouterEtudiants with correct params and body', async () => {
      const idGroupe = '1';
      const newStudents = { etudiants: [4, 5] };
      const response = await request(app)
        .post(`/api/groupe/${idGroupe}/etudiants`)
        .send(newStudents);
      expect(response.status).toBe(201);
      expect(mockControllers.ajouterEtudiants).toHaveBeenCalled();
      expect(mockControllers.ajouterEtudiants.mock.calls[0][0].params.idGroupe).toBe(idGroupe);
      expect(mockControllers.ajouterEtudiants.mock.calls[0][0].body).toEqual(newStudents);
    });

    it('GET /groupe/:idGroupe/etudiants - should call afficherEtudiantsDansGroupe with correct params', async () => {
      const idGroupe = '1';
      const response = await request(app).get(`/api/groupe/${idGroupe}/etudiants`);
      expect(response.status).toBe(200);
      expect(mockControllers.afficherEtudiantsDansGroupe).toHaveBeenCalled();
      expect(mockControllers.afficherEtudiantsDansGroupe.mock.calls[0][0].params.idGroupe).toBe(idGroupe);
    });

    it('GET /groupe/:idGroupe/etudiants-hors/:idFiliere - should call afficherEtudiantsHorsGroupe with correct params', async () => {
      const idGroupe = '1';
      const idFiliere = '2';
      const response = await request(app).get(`/api/groupe/${idGroupe}/etudiants-hors/${idFiliere}`);
      expect(response.status).toBe(200);
      expect(mockControllers.afficherEtudiantsHorsGroupe).toHaveBeenCalled();
      expect(mockControllers.afficherEtudiantsHorsGroupe.mock.calls[0][0].params.idGroupe).toBe(idGroupe);
      expect(mockControllers.afficherEtudiantsHorsGroupe.mock.calls[0][0].params.idFiliere).toBe(idFiliere);
    });
  });
});