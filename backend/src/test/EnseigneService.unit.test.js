import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  affecterFilieresAEncadrant,
  getFilieresByEncadrant,
  retirerFiliereAEncadrant
} from './EnseigneService.js';

// Mock des modèles Sequelize
vi.mock('../sync.js', () => {
  const Enseigne = {
    bulkCreate: vi.fn(),
    findAll: vi.fn(),
    destroy: vi.fn()
  };

  const Encadrant = {
    findOne: vi.fn()
  };

  const Filiere = {
    build: vi.fn()
  };

  return { Enseigne, Encadrant, Filiere };
});

import { Enseigne, Encadrant, Filiere } from '../sync.js';

describe('EncadrantFiliereService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('affecterFilieresAEncadrant', () => {
    it('should call Encadrant.findOne and Enseigne.bulkCreate with correct parameters', async () => {
      // Arrange
      const numSum = 'ENC001';
      const listeIdFiliere = [1, 2];
      const mockEncadrant = { Num_sum: numSum };
      
      Encadrant.findOne.mockResolvedValue(mockEncadrant);
      Enseigne.bulkCreate.mockResolvedValue(true);

      // Act
      await affecterFilieresAEncadrant(numSum, listeIdFiliere);

      // Assert
      expect(Encadrant.findOne).toHaveBeenCalledWith({ where: { Num_sum: numSum } });
      expect(Enseigne.bulkCreate).toHaveBeenCalledWith([
        { Num_sum: numSum, Id_F: 1 },
        { Num_sum: numSum, Id_F: 2 }
      ]);
    });

    it('should throw error when encadrant is not found', async () => {
      Encadrant.findOne.mockResolvedValue(null);
      
      await expect(affecterFilieresAEncadrant('INVALID', [1]))
        .rejects
        .toThrow('Encadrant non trouvé.');
    });

    it('should propagate database errors', async () => {
      Encadrant.findOne.mockResolvedValue({ Num_sum: 'ENC001' });
      Enseigne.bulkCreate.mockRejectedValue(new Error('DB Error'));
      
      await expect(affecterFilieresAEncadrant('ENC001', [1]))
        .rejects
        .toThrow('DB Error');
    });
  });

  describe('getFilieresByEncadrant', () => {
    it('should call Enseigne.findAll with correct parameters and return filieres', async () => {
      // Arrange
      const numSum = 'ENC001';
      const mockFilieres = [
        { Id_F: 1, nom: 'Informatique' },
        { Id_F: 2, nom: 'Mathématiques' }
      ];
      
      const mockEnseignes = mockFilieres.map(filiere => ({
        filiere,
        toJSON: () => ({ filiere })
      }));
      
      Enseigne.findAll.mockResolvedValue(mockEnseignes);

      // Act
      const result = await getFilieresByEncadrant(numSum);

      // Assert
      expect(Enseigne.findAll).toHaveBeenCalledWith({
        where: { Num_sum: numSum },
        include: [{ model: Filiere, as: 'filiere' }]
      });
      expect(result).toEqual(mockFilieres);
    });

    it('should return empty array when no filieres found', async () => {
      Enseigne.findAll.mockResolvedValue([]);
      
      const result = await getFilieresByEncadrant('ENC001');
      
      expect(result).toEqual([]);
    });

    it('should propagate database errors', async () => {
      Enseigne.findAll.mockRejectedValue(new Error('DB Error'));
      
      await expect(getFilieresByEncadrant('ENC001'))
        .rejects
        .toThrow('DB Error');
    });
  });

  describe('retirerFiliereAEncadrant', () => {
    it('should call Enseigne.destroy with correct parameters', async () => {
      // Arrange
      const numSum = 'ENC001';
      const idFiliere = 1;
      Enseigne.destroy.mockResolvedValue(1);

      // Act
      await retirerFiliereAEncadrant(numSum, idFiliere);

      // Assert
      expect(Enseigne.destroy).toHaveBeenCalledWith({
        where: {
          Num_sum: numSum,
          Id_F: idFiliere
        }
      });
    });

    it('should throw error when no association is found', async () => {
      Enseigne.destroy.mockResolvedValue(0);
      
      await expect(retirerFiliereAEncadrant('ENC001', 99))
        .rejects
        .toThrow('Association non trouvée.');
    });

    it('should propagate database errors', async () => {
      Enseigne.destroy.mockRejectedValue(new Error('DB Error'));
      
      await expect(retirerFiliereAEncadrant('ENC001', 1))
        .rejects
        .toThrow('DB Error');
    });
  });
});