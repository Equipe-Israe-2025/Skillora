import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';

// Mock des services
vi.mock('../services/utilisateurService.js', () => ({
  creerUtilisateurService: vi.fn(),
  getAllUtilisateursService: vi.fn(),
  getUtilisateurByIdService: vi.fn(),
  updateUtilisateurService: vi.fn(),
  deleteUtilisateurService: vi.fn(),
  updateUserProfileImageService: vi.fn(),
  authenticateUserService: vi.fn(),
}));

import {
  creerUtilisateurService,
  getAllUtilisateursService,
  getUtilisateurByIdService,
  updateUtilisateurService,
  deleteUtilisateurService,
  updateUserProfileImageService,
  authenticateUserService,
} from '../services/utilisateurService.js';

import {
  creerUtilisateur,
  getAllUtilisateurs,
  getUtilisateurById,
  updateUtilisateur,
  deleteUtilisateur,
  updateUserProfileImage,
  loginUtilisateur,
} from './utilisateurController.js';

const app = express();
app.use(bodyParser.json());

// Middleware multer simulé pour test
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/utilisateurs', creerUtilisateur);
app.get('/utilisateurs', getAllUtilisateurs);
app.get('/utilisateurs/:id', getUtilisateurById);
app.put('/utilisateurs/:id', updateUtilisateur);
app.delete('/utilisateurs/:id', deleteUtilisateur);
app.post('/utilisateurs/login', loginUtilisateur);
app.post('/utilisateurs/upload', upload.single('image'), updateUserProfileImage);

describe('UtilisateurController - Tests d’intégration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('POST /utilisateurs - créer un utilisateur', async () => {
    const mockUser = { id: 1, nom: 'Test', email: 'test@mail.com' };
    creerUtilisateurService.mockResolvedValue(mockUser);

    const res = await request(app).post('/utilisateurs').send({
      nom: 'Test',
      email: 'test@mail.com',
      password: '123456',
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Utilisateur créé avec succès.', utilisateur: mockUser });
  });

  it('GET /utilisateurs - liste des utilisateurs', async () => {
    const users = [{ id: 1, nom: 'Test' }];
    getAllUtilisateursService.mockResolvedValue(users);

    const res = await request(app).get('/utilisateurs');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(users);
  });

  it('GET /utilisateurs/:id - récupérer un utilisateur', async () => {
    const user = { id: 1, nom: 'Test' };
    getUtilisateurByIdService.mockResolvedValue(user);

    const res = await request(app).get('/utilisateurs/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(user);
  });

  it('PUT /utilisateurs/:id - mettre à jour un utilisateur', async () => {
    const updatedUser = { id: 1, nom: 'Modifié' };
    updateUtilisateurService.mockResolvedValue(updatedUser);

    const res = await request(app).put('/utilisateurs/1').send({ nom: 'Modifié' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Utilisateur mis à jour avec succès.', user: updatedUser });
  });

  it('DELETE /utilisateurs/:id - supprimer un utilisateur', async () => {
    deleteUtilisateurService.mockResolvedValue();

    const res = await request(app).delete('/utilisateurs/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Utilisateur supprimé avec succès.' });
  });

  it('POST /utilisateurs/login - connecter un utilisateur', async () => {
    authenticateUserService.mockResolvedValue({
      token: 'fake-token',
      user: { id: 1, email: 'test@mail.com' },
    });

    const res = await request(app).post('/utilisateurs/login').send({
      email: 'test@mail.com',
      password: '123456',
      role: 'admin',
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      token: 'fake-token',
      user: { id: 1, email: 'test@mail.com' },
    });
  });

  it('POST /utilisateurs/upload - upload image de profil', async () => {
    updateUserProfileImageService.mockResolvedValue({
      message: 'Image mise à jour',
      imagePath: '/uploads/test.jpg',
    });

    const res = await request(app)
      .post('/utilisateurs/upload')
      .field('userId', '1')
      .attach('image', Buffer.from('image fake'), 'test.jpg');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Image mise à jour',
      imagePath: '/uploads/test.jpg',
    });
  });
});
