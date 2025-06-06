import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  create,
  getAll,
  getById,
  update,
  removeComp
} from './CompetenceController.js';

// Mock complet des fonctions du service
vi.mock('../services/CompetenceService.js', () => ({
  createCompetence: vi.fn(),
  getAllCompetences: vi.fn(),
  getCompetenceById: vi.fn(),
  updateCompetence: vi.fn(),
  deleteCompetence: vi.fn()
}));

describe('Competence Controller - Integration Tests', () => {
  let req, res;
  let competenceService;

  beforeEach(async () => {
    vi.resetAllMocks(); // Remet à zéro tous les mocks

    // Import dynamique pour récupérer les mocks
    competenceService = await import('../services/CompetenceService.js');

    // Simuler req et res d’Express
    req = { params: {}, body: {} };
    res = {
      status: vi.fn(() => res), // Pour permettre le chainage (res.status(201).json(...))
      json: vi.fn(),
      send: vi.fn()
    };
  });

  describe('create', () => {
    it('should create a new competence successfully', async () => {
      const mockCompetence = { id: 1, name: 'JavaScript', description: 'Programming language' };
      competenceService.createCompetence.mockResolvedValue(mockCompetence);
      req.body = { name: 'JavaScript', description: 'Programming language' };

      await create(req, res);

      expect(competenceService.createCompetence).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCompetence);
    });

    it('should handle validation errors', async () => {
      competenceService.createCompetence.mockRejectedValue(new Error('Name is required'));
      req.body = { description: 'Missing name' };

      await create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Name is required' });
    });
  });

  describe('getAll', () => {
    it('should return all competences', async () => {
      const mockCompetences = [{ id: 1, name: 'JavaScript' }, { id: 2, name: 'TypeScript' }];
      competenceService.getAllCompetences.mockResolvedValue(mockCompetences);

      await getAll(req, res);

      expect(competenceService.getAllCompetences).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCompetences);
    });

    it('should handle database errors', async () => {
      competenceService.getAllCompetences.mockRejectedValue(new Error('Database connection failed'));

      await getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database connection failed' });
    });
  });

  describe('getById', () => {
    it('should return a specific competence', async () => {
      const mockCompetence = { id: 1, name: 'JavaScript' };
      competenceService.getCompetenceById.mockResolvedValue(mockCompetence);
      req.params.id = '1';

      await getById(req, res);

      expect(competenceService.getCompetenceById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCompetence);
    });

    it('should return 404 if competence not found', async () => {
      competenceService.getCompetenceById.mockResolvedValue(null);
      req.params.id = '999';

      await getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Competence not found' });
    });

    it('should handle server errors', async () => {
      competenceService.getCompetenceById.mockRejectedValue(new Error('Internal server error'));
      req.params.id = '1';

      await getById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('update', () => {
    it('should update an existing competence', async () => {
      const updatedCompetence = { id: 1, name: 'JavaScript ES6' };
      competenceService.updateCompetence.mockResolvedValue(updatedCompetence);
      req.params.id = '1';
      req.body = { name: 'JavaScript ES6' };

      await update(req, res);

      expect(competenceService.updateCompetence).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedCompetence);
    });

    it('should handle invalid update data', async () => {
      competenceService.updateCompetence.mockRejectedValue(new Error('Invalid data provided'));
      req.params.id = '1';
      req.body = { name: '' };

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid data provided' });
    });
  });

  describe('removeComp', () => {
    it('should delete a competence successfully', async () => {
      const deleteResult = { success: true };
      competenceService.deleteCompetence.mockResolvedValue(deleteResult);
      req.params.id = '1';

      await removeComp(req, res);

      expect(competenceService.deleteCompetence).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(deleteResult);
    });

    it('should handle attempt to delete non-existent competence', async () => {
      competenceService.deleteCompetence.mockRejectedValue(new Error('Competence not found'));
      req.params.id = '999';

      await removeComp(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Competence not found' });
    });
  });
});

