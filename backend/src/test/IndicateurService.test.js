import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as indicateurService from './IndicateurService.js'; 
import { Indicateur, Competence } from '../sync.js';

vi.mock('../sync.js', () => ({
  Indicateur: {
    findByPk: vi.fn(),
    create: vi.fn(),
    findAll: vi.fn(),
  },
  Competence: {
    findByPk: vi.fn(),
  },
}));

describe('Indicateur Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createIndicateur', () => {
    it('crée un indicateur si la compétence existe', async () => {
      const data = { libelle: 'test', description: 'desc', Id_C: 1 };
      
      Competence.findByPk.mockResolvedValue({ Id_C: 1, nom: 'Compétence test' });
      Indicateur.create.mockResolvedValue({ id: 10, ...data });

      const result = await indicateurService.createIndicateur(data);

      expect(Competence.findByPk).toHaveBeenCalledWith(1);
      expect(Indicateur.create).toHaveBeenCalledWith(data);
      expect(result).toEqual({ id: 10, ...data });
    });

    it('lance une erreur si la compétence n\'existe pas', async () => {
      Competence.findByPk.mockResolvedValue(null);

      await expect(indicateurService.createIndicateur({ libelle: 'test', description: 'desc', Id_C: 999 }))
        .rejects.toThrow('Compétence non trouvée');
    });
  });

  describe('getAllIndicateurs', () => {
    it('récupère tous les indicateurs avec leurs compétences', async () => {
      const mockData = [{ id: 1, libelle: 'lib', competence: { Id_C: 1, nom: 'comp' } }];
      Indicateur.findAll.mockResolvedValue(mockData);

      const result = await indicateurService.getAllIndicateurs();

      expect(Indicateur.findAll).toHaveBeenCalledWith({
        include: {
          model: Competence,
          as: 'competence',
          attributes: ['Id_C', 'nom'],
        },
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('getIndicateursByCompetence', () => {
    it('récupère les indicateurs d\'une compétence donnée', async () => {
      const competenceId = 5;
      const mockData = [{ id: 2, libelle: 'lib2', Id_C: competenceId, competence: { Id_C: competenceId, nom: 'comp' } }];
      Indicateur.findAll.mockResolvedValue(mockData);

      const result = await indicateurService.getIndicateursByCompetence(competenceId);

      expect(Indicateur.findAll).toHaveBeenCalledWith({
        where: { Id_C: competenceId },
        include: {
          model: Competence,
          as: 'competence',
          attributes: ['Id_C', 'nom'],
        },
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('updateIndicateur', () => {
    it('met à jour un indicateur existant', async () => {
      const Id_I = 3;
      const data = { libelle: 'modifié' };
      const mockIndicateur = {
        update: vi.fn().mockResolvedValue(),
        id: Id_I,
        libelle: 'ancien',
      };

      Indicateur.findByPk.mockResolvedValue(mockIndicateur);

      const result = await indicateurService.updateIndicateur(Id_I, data);

      expect(Indicateur.findByPk).toHaveBeenCalledWith(Id_I);
      expect(mockIndicateur.update).toHaveBeenCalledWith(data);
      expect(result).toBe(mockIndicateur);
    });

    it('lance une erreur si l\'indicateur n\'existe pas', async () => {
      Indicateur.findByPk.mockResolvedValue(null);

      await expect(indicateurService.updateIndicateur(999, { libelle: 'x' }))
        .rejects.toThrow('Indicateur non trouvé');
    });
  });

  describe('deleteIndicateur', () => {
    it('supprime un indicateur existant', async () => {
      const Id_I = 4;
      const mockIndicateur = {
        destroy: vi.fn().mockResolvedValue(),
      };

      Indicateur.findByPk.mockResolvedValue(mockIndicateur);

      const result = await indicateurService.deleteIndicateur(Id_I);

      expect(Indicateur.findByPk).toHaveBeenCalledWith(Id_I);
      expect(mockIndicateur.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Indicateur supprimé avec succès' });
    });

    it('lance une erreur si l\'indicateur n\'existe pas', async () => {
      Indicateur.findByPk.mockResolvedValue(null);

      await expect(indicateurService.deleteIndicateur(999))
        .rejects.toThrow('Indicateur non trouvé');
    });
  });
});
