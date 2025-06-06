import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

// Mock des services
vi.mock('../services/signalementService.js', () => ({
  createSignalementService: vi.fn(),
  getAllSignalementsService: vi.fn(),
  deleteSignalementService: vi.fn()
}));

import {
  createSignalementService,
  getAllSignalementsService,
  deleteSignalementService
} from '../services/signalementService.js';

import {
  createSignalement,
  getAllSignalements,
  deleteSignalement
} from './signalementController.js';

// Configuration de l'application Express de test
const app = express();
app.use(bodyParser.json());

// Middleware pour simuler l'authentification
app.use((req, res, next) => {
  req.user = { id: 'user123' }; // Simule un utilisateur connecté
  next();
});

// Routes
app.post('/signalements', createSignalement);
app.get('/signalements', getAllSignalements);
app.delete('/signalements/:id', deleteSignalement);

describe('SignalementController - Tests d\'Intégration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /signalements', () => {
    it('devrait créer un signalement avec succès (201)', async () => {
      const mockSignalement = {
        id: 1,
        description: 'Problème technique',
        CNE: 'ABC123',
        Id_U: 'user123'
      };
      createSignalementService.mockResolvedValue(mockSignalement);

      const res = await request(app)
        .post('/signalements')
        .send({
          description: 'Problème technique',
          CNE: 'ABC123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockSignalement);
      expect(createSignalementService).toHaveBeenCalledWith({
        description: 'Problème technique',
        CNE: 'ABC123',
        Id_U: 'user123'
      });
    });

    it('devrait retourner 500 en cas d\'erreur', async () => {
      createSignalementService.mockRejectedValue(new Error('Erreur de base de données'));

      const res = await request(app)
        .post('/signalements')
        .send({
          description: 'Problème technique',
          CNE: 'ABC123'
        });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Erreur de base de données'
      });
    });
  });

  describe('GET /signalements', () => {
    it('devrait récupérer tous les signalements (200)', async () => {
      const mockSignalements = [
        { id: 1, description: 'Problème 1', CNE: 'ABC123', Id_U: 'user123' },
        { id: 2, description: 'Problème 2', CNE: 'DEF456', Id_U: 'user456' }
      ];
      getAllSignalementsService.mockResolvedValue(mockSignalements);

      const res = await request(app).get('/signalements');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockSignalements);
      expect(getAllSignalementsService).toHaveBeenCalled();
    });

    it('devrait retourner 500 en cas d\'erreur', async () => {
      getAllSignalementsService.mockRejectedValue(new Error('Erreur de récupération'));

      const res = await request(app).get('/signalements');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Erreur de récupération'
      });
    });
  });

  describe('DELETE /signalements/:id', () => {
    it('devrait supprimer un signalement avec succès (200)', async () => {
      deleteSignalementService.mockResolvedValue();

      const res = await request(app).delete('/signalements/123');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'Signalement supprimé avec succès.'
      });
      expect(deleteSignalementService).toHaveBeenCalledWith('123');
    });

    it('devrait retourner 500 en cas d\'erreur de suppression', async () => {
      deleteSignalementService.mockRejectedValue(new Error('Erreur de suppression'));

      const res = await request(app).delete('/signalements/123');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Erreur de suppression'
      });
    });
  });
});