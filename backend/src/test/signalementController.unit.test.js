import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createSignalement,
  getAllSignalements,
  deleteSignalement
} from './signalementController.js';

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

describe('SignalementController - Tests Unitaires', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createSignalement', () => {
    it('devrait créer un signalement avec succès et retourner 201', async () => {
      const mockSignalement = {
        id: 1,
        description: 'Problème technique',
        CNE: 'ABC123',
        Id_U: 'user123'
      };
      createSignalementService.mockResolvedValue(mockSignalement);

      const req = {
        body: {
          description: 'Problème technique',
          CNE: 'ABC123'
        },
        user: {
          id: 'user123'
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await createSignalement(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSignalement);
      expect(createSignalementService).toHaveBeenCalledWith({
        description: 'Problème technique',
        CNE: 'ABC123',
        Id_U: 'user123'
      });
    });

    it('devrait gérer les erreurs et retourner 500', async () => {
      const error = new Error('Erreur de base de données');
      createSignalementService.mockRejectedValue(error);

      const req = {
        body: {
          description: 'Problème technique',
          CNE: 'ABC123'
        },
        user: {
          id: 'user123'
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await createSignalement(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erreur de base de données'
      });
    });
  });

  describe('getAllSignalements', () => {
    it('devrait retourner tous les signalements avec statut 200', async () => {
      const mockSignalements = [
        { id: 1, description: 'Problème 1', CNE: 'ABC123', Id_U: 'user123' },
        { id: 2, description: 'Problème 2', CNE: 'DEF456', Id_U: 'user456' }
      ];
      getAllSignalementsService.mockResolvedValue(mockSignalements);

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await getAllSignalements(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSignalements);
      expect(getAllSignalementsService).toHaveBeenCalled();
    });

    it('devrait gérer les erreurs et retourner 500', async () => {
      const error = new Error('Erreur de récupération');
      getAllSignalementsService.mockRejectedValue(error);

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await getAllSignalements(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erreur de récupération'
      });
    });
  });

  describe('deleteSignalement', () => {
    it('devrait supprimer un signalement et retourner 200', async () => {
      deleteSignalementService.mockResolvedValue();

      const req = {
        params: { id: '123' }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await deleteSignalement(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Signalement supprimé avec succès.'
      });
      expect(deleteSignalementService).toHaveBeenCalledWith('123');
    });

    it('devrait gérer les erreurs de suppression et retourner 500', async () => {
      const error = new Error('Erreur de suppression');
      deleteSignalementService.mockRejectedValue(error);

      const req = {
        params: { id: '123' }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await deleteSignalement(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erreur de suppression'
      });
    });
  });
});