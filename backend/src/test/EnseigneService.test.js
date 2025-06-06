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

describe('EncadrantFiliereService Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('affecterFilieresAEncadrant', () => {
    it('should assign filieres to encadrant successfully', async () => {
      // Mock de l'encadrant existant
      Encadrant.findOne.mockResolvedValue({ Num_sum: 'ENC001' });
      
      // Mock de la création des associations
      Enseigne.bulkCreate.mockResolvedValue([
        { Num_sum: 'ENC001', Id_F: 1 },
        { Num_sum: 'ENC001', Id_F: 2 }
      ]);

      const result = await affecterFilieresAEncadrant('ENC001', [1, 2]);

      expect(Encadrant.findOne).toHaveBeenCalledWith({ where: { Num_sum: 'ENC001' } });
      expect(Enseigne.bulkCreate).toHaveBeenCalledWith([
        { Num_sum: 'ENC001', Id_F: 1 },
        { Num_sum: 'ENC001', Id_F: 2 }
      ]);
      expect(result).toEqual({ message: 'Filières affectées avec succès.' });
    });

    it('should throw error when encadrant does not exist', async () => {
      Encadrant.findOne.mockResolvedValue(null);

      await expect(affecterFilieresAEncadrant('INVALID', [1]))
        .rejects
        .toThrow('Encadrant non trouvé.');
    });

    it('should throw error when bulkCreate fails', async () => {
      Encadrant.findOne.mockResolvedValue({ Num_sum: 'ENC001' });
      Enseigne.bulkCreate.mockRejectedValue(new Error('Database error'));

      await expect(affecterFilieresAEncadrant('ENC001', [1]))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('getFilieresByEncadrant', () => {
    it('should return filieres for an encadrant', async () => {
      const mockFilieres = [
        { Id_F: 1, nom: 'Informatique' },
        { Id_F: 2, nom: 'Mathématiques' }
      ];

      const mockEnseignes = [
        { 
          Num_sum: 'ENC001', 
          Id_F: 1, 
          filiere: mockFilieres[0],
          toJSON: vi.fn(() => ({ Num_sum: 'ENC001', Id_F: 1, filiere: mockFilieres[0] }))
        },
        { 
          Num_sum: 'ENC001', 
          Id_F: 2, 
          filiere: mockFilieres[1],
          toJSON: vi.fn(() => ({ Num_sum: 'ENC001', Id_F: 2, filiere: mockFilieres[1] }))
        }
      ];

      Enseigne.findAll.mockResolvedValue(mockEnseignes);

      const result = await getFilieresByEncadrant('ENC001');

      expect(Enseigne.findAll).toHaveBeenCalledWith({
        where: { Num_sum: 'ENC001' },
        include: [{ model: Filiere, as: 'filiere' }]
      });
      expect(result).toEqual(mockFilieres);
    });

    it('should return empty array when no filieres found', async () => {
      Enseigne.findAll.mockResolvedValue([]);

      const result = await getFilieresByEncadrant('ENC001');

      expect(result).toEqual([]);
    });

    it('should throw error when findAll fails', async () => {
      Enseigne.findAll.mockRejectedValue(new Error('Database error'));

      await expect(getFilieresByEncadrant('ENC001'))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('retirerFiliereAEncadrant', () => {
    it('should remove filiere from encadrant successfully', async () => {
      Enseigne.destroy.mockResolvedValue(1); // 1 ligne affectée

      const result = await retirerFiliereAEncadrant('ENC001', 1);

      expect(Enseigne.destroy).toHaveBeenCalledWith({
        where: {
          Num_sum: 'ENC001',
          Id_F: 1
        }
      });
      expect(result).toEqual({ message: 'Filière retirée avec succès.' });
    });

    it('should throw error when association does not exist', async () => {
      Enseigne.destroy.mockResolvedValue(0); // Aucune ligne affectée

      await expect(retirerFiliereAEncadrant('ENC001', 99))
        .rejects
        .toThrow('Association non trouvée.');
    });

    it('should throw error when destroy fails', async () => {
      Enseigne.destroy.mockRejectedValue(new Error('Database error'));

      await expect(retirerFiliereAEncadrant('ENC001', 1))
        .rejects
        .toThrow('Database error');
    });
  });
});