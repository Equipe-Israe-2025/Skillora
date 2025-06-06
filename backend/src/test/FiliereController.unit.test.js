import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  create,
  update,
  supprimer
} from './FiliereController.js';

// Mock des services
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

describe('FiliereController', () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    vi.resetAllMocks();

    // Configuration des objets mock
    mockRequest = {
      body: {},
      params: {}
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  describe('create()', () => {
    it('devrait créer une filière avec succès et retourner 201', async () => {
      // Arrange
      const mockFiliere = { id: 1, nom: 'Informatique' };
      createFiliere.mockResolvedValue(mockFiliere);
      mockRequest.body = { nom: 'Informatique' };

      // Act
      await create(mockRequest, mockResponse);

      // Assert
      expect(createFiliere).toHaveBeenCalledWith({ nom: 'Informatique' });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockFiliere);
    });

    it('devrait gérer les erreurs et retourner 500', async () => {
      // Arrange
      const errorMessage = 'Erreur de base de données';
      createFiliere.mockRejectedValue(new Error(errorMessage));
      mockRequest.body = { nom: 'Erreur' };

      // Act
      await create(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('update()', () => {
    it('devrait mettre à jour une filière existante et retourner 200', async () => {
      // Arrange
      const mockUpdated = { id: 1, nom: 'Mathématiques' };
      updateFiliere.mockResolvedValue(mockUpdated);
      mockRequest.params = { id: '1' };
      mockRequest.body = { nom: 'Mathématiques' };

      // Act
      await update(mockRequest, mockResponse);

      // Assert
      expect(updateFiliere).toHaveBeenCalledWith('1', { nom: 'Mathématiques' });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdated);
    });

    it('devrait retourner 404 si la filière à mettre à jour n\'existe pas', async () => {
      // Arrange
      const errorMessage = 'Filière non trouvée';
      updateFiliere.mockRejectedValue(new Error(errorMessage));
      mockRequest.params = { id: '999' };
      mockRequest.body = { nom: 'Inexistante' };

      // Act
      await update(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('devrait gérer les erreurs de validation', async () => {
      // Arrange
      const errorMessage = 'Nom invalide';
      updateFiliere.mockRejectedValue(new Error(errorMessage));
      mockRequest.params = { id: '1' };
      mockRequest.body = { nom: '' }; // Nom vide

      // Act
      await update(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('supprimer()', () => {
    it('devrait supprimer une filière existante et retourner 200', async () => {
      // Arrange
      const mockResult = { success: true, message: 'Filière supprimée' };
      deleteFiliere.mockResolvedValue(mockResult);
      mockRequest.params = { id: '1' };

      // Act
      await supprimer(mockRequest, mockResponse);

      // Assert
      expect(deleteFiliere).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('devrait retourner 404 si la filière à supprimer n\'existe pas', async () => {
      // Arrange
      const errorMessage = 'Filière non trouvée';
      deleteFiliere.mockRejectedValue(new Error(errorMessage));
      mockRequest.params = { id: '999' };

      // Act
      await supprimer(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('devrait gérer les erreurs inattendues', async () => {
      // Arrange
      const errorMessage = 'Erreur inattendue';
      deleteFiliere.mockRejectedValue(new Error(errorMessage));
      mockRequest.params = { id: '1' };

      // Act
      await supprimer(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});