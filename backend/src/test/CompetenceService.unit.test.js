import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createCompetence,
  getAllCompetences,
  getCompetenceById,
  updateCompetence,
  deleteCompetence
} from './CompetenceService.js';

// Mock des modèles Sequelize
vi.mock('../sync.js', () => {
  const Competence = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    findByPk: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn()
  };

  const Indicateur = {
    build: vi.fn()
  };

  return { Competence, Indicateur };
});

import { Competence, Indicateur } from '../sync.js';

describe('CompetenceService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCompetence', () => {
    it('should create a new competence', async () => {
      const mockData = { Id_C: 'C001', nom: 'Algorithmique', description: 'Description test' };
      const mockResult = { 
        ...mockData, 
        toJSON: vi.fn(() => mockData) 
      };
      Competence.create.mockResolvedValue(mockResult);

      const result = await createCompetence(mockData);

      expect(Competence.create).toHaveBeenCalledWith(mockData);
      // Utiliser toJSON() pour obtenir l'objet brut
      expect(result.toJSON()).toEqual(mockData);
    });

    it('should throw error when creation fails', async () => {
      Competence.create.mockRejectedValue(new Error('Database error'));
      await expect(createCompetence({})).rejects.toThrow('Database error');
    });
  });

  describe('getAllCompetences', () => {
    it('should return all competences with only Id_C and nom', async () => {
      const mockCompetences = [
        { 
          Id_C: 'C001', 
          nom: 'Algo', 
          toJSON: vi.fn(() => ({ Id_C: 'C001', nom: 'Algo' })) 
        },
        { 
          Id_C: 'C002', 
          nom: 'Maths', 
          toJSON: vi.fn(() => ({ Id_C: 'C002', nom: 'Maths' })) 
        }
      ];
      Competence.findAll.mockResolvedValue(mockCompetences);

      const result = await getAllCompetences();

      expect(Competence.findAll).toHaveBeenCalledWith({
        attributes: ['Id_C', 'nom']
      });
      // Appeler toJSON() sur chaque élément
      expect(result.map(item => item.toJSON())).toEqual([
        { Id_C: 'C001', nom: 'Algo' },
        { Id_C: 'C002', nom: 'Maths' }
      ]);
    });
  });

  describe('getCompetenceById', () => {
    it('should return a competence with its indicators', async () => {
      const mockIndicateurs = [
        { Id_C: 'C001', libelle: 'Indicateur 1' },
        { Id_C: 'C001', libelle: 'Indicateur 2' }
      ];
      const mockCompetence = {
        Id_C: 'C001',
        nom: 'Algo',
        description: 'Desc',
        Indicateurs: mockIndicateurs,
        toJSON: vi.fn(() => ({
          Id_C: 'C001',
          nom: 'Algo',
          description: 'Desc',
          Indicateurs: mockIndicateurs
        }))
      };
      Competence.findOne.mockResolvedValue(mockCompetence);

      const result = await getCompetenceById('C001');

      expect(Competence.findOne).toHaveBeenCalledWith({
        where: { Id_C: 'C001' },
        include: [
          {
            model: Indicateur,
            attributes: ['Id_C', 'libelle']
          }
        ]
      });
      // Vérifier les propriétés après toJSON()
      const jsonResult = result.toJSON();
      expect(jsonResult.Id_C).toBe('C001');
      expect(jsonResult.Indicateurs).toEqual(mockIndicateurs);
    });

    it('should throw error when competence not found', async () => {
      Competence.findOne.mockResolvedValue(null);
      await expect(getCompetenceById('INVALID')).rejects.toThrow('Compétence non trouvée');
    });
  });

  describe('updateCompetence', () => {
    it('should update an existing competence', async () => {
      const mockData = { nom: 'Nouveau nom' };
      const updatedData = { ...mockData, Id_C: 'C001' };
      const mockCompetence = {
        Id_C: 'C001',
        update: vi.fn().mockResolvedValue({ 
          ...updatedData,
          toJSON: vi.fn(() => updatedData)
        })
      };
      Competence.findByPk.mockResolvedValue(mockCompetence);

      const result = await updateCompetence('C001', mockData);

      expect(Competence.findByPk).toHaveBeenCalledWith('C001');
      expect(mockCompetence.update).toHaveBeenCalledWith(mockData);
      expect(result.toJSON()).toEqual(updatedData);
    });

    it('should throw error when competence not found', async () => {
      Competence.findByPk.mockResolvedValue(null);
      await expect(updateCompetence('INVALID', {})).rejects.toThrow('Competence not found');
    });
  });

  describe('deleteCompetence', () => {
    it('should delete an existing competence', async () => {
      const mockCompetence = {
        Id_C: 'C001',
        destroy: vi.fn().mockResolvedValue(true),
        toJSON: vi.fn(() => ({ Id_C: 'C001' }))
      };
      Competence.findByPk.mockResolvedValue(mockCompetence);

      const result = await deleteCompetence('C001');

      expect(Competence.findByPk).toHaveBeenCalledWith('C001');
      expect(mockCompetence.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Compétence supprimée avec succès' });
    });

    it('should throw error when competence not found', async () => {
      Competence.findByPk.mockResolvedValue(null);
      await expect(deleteCompetence('INVALID')).rejects.toThrow('Compétence non trouvée');
    });
  });
});