import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';


vi.mock('../../config/db.js', () => ({ default: {} }));


vi.mock('../services/FiliereService.js', () => ({
  createFiliere: vi.fn(),
  updateFiliere: vi.fn(),
  deleteFiliere: vi.fn()
}));


import {
  createFiliere,
  updateFiliere,
  deleteFiliere
} from '../services/FiliereService.js';

import {
  create,
  update,
  supprimer
} from './FiliereController.js';


const app = express();
app.use(express.json());
app.post('/filieres', create);
app.put('/filieres/:id', update);
app.delete('/filieres/:id', supprimer);


afterEach(() => {
  vi.clearAllMocks();
});

describe('FiliereController', () => {
  it('POST /filieres - retourne 201 si création réussie', async () => {
    createFiliere.mockResolvedValue({ id: 1, nom: 'Informatique' });

    const res = await request(app)
      .post('/filieres')
      .send({ nom: 'Informatique' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, nom: 'Informatique' });
  });

  it('POST /filieres - retourne 500 si erreur serveur', async () => {
    createFiliere.mockRejectedValue(new Error('Erreur serveur'));

    const res = await request(app)
      .post('/filieres')
      .send({ nom: 'Erreur' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Erreur serveur' });
  });

  it('PUT /filieres/:id - retourne 200 si mise à jour réussie', async () => {
    updateFiliere.mockResolvedValue({ id: 1, nom: 'Mathématiques' });

    const res = await request(app)
      .put('/filieres/1')
      .send({ nom: 'Mathématiques' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, nom: 'Mathématiques' });
  });

  it('PUT /filieres/:id - retourne 404 si la filière est introuvable', async () => {
    updateFiliere.mockRejectedValue(new Error('Filière introuvable'));

    const res = await request(app)
      .put('/filieres/99')
      .send({ nom: 'NonExistant' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Filière introuvable' });
  });

  it('DELETE /filieres/:id - retourne 200 si suppression réussie', async () => {
    deleteFiliere.mockResolvedValue({ message: 'Filière supprimée avec succès' });

    const res = await request(app)
      .delete('/filieres/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Filière supprimée avec succès' });
  });

  it('DELETE /filieres/:id - retourne 404 si la filière est introuvable', async () => {
    deleteFiliere.mockRejectedValue(new Error('Filière non trouvée'));

    const res = await request(app)
      .delete('/filieres/99');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Filière non trouvée' });
  });
});



