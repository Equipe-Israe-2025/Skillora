import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createEvaluationController,
  getAllEvaluationsController,
  getEvaluationDetailsController,
  updateEvaluationController,
  deleteEvaluationController,
  getStudentEvaluationsController
} from './EvaluationController.js';

import * as evaluationService from '../services/EvaluationService.js';

// Mock des fonctions du service
vi.mock('../services/EvaluationService.js', () => ({
  createEvaluation: vi.fn(),
  getAllEvaluations: vi.fn(),
  getEvaluationDetails: vi.fn(),
  updateEvaluation: vi.fn(),
  deleteEvaluation: vi.fn(),
  getStudentEvaluations: vi.fn()
}));

describe('EvaluationController - Integration Test', () => {
  let req, res;

  beforeEach(() => {
    vi.resetAllMocks();
    req = {
      params: {},
      body: {},
      query: {},
      user: { id: 'USER001' }
    };
    res = {
      status: vi.fn(() => res),
      json: vi.fn()
    };
  });

  describe('createEvaluationController', () => {
    it('should create evaluation successfully', async () => {
      const mockEval = { id: 1, titre: 'DS1' };
      evaluationService.createEvaluation.mockResolvedValue(mockEval);

      req.body = { titre: 'DS1' };

      await createEvaluationController(req, res);

      expect(evaluationService.createEvaluation).toHaveBeenCalledWith(req.body, 'USER001');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockEval);
    });

    it('should handle error on create', async () => {
      evaluationService.createEvaluation.mockRejectedValue(new Error('Invalid data'));

      await createEvaluationController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid data' });
    });
  });

  describe('getAllEvaluationsController', () => {
    it('should return all evaluations', async () => {
      const evaluations = [{ id: 1 }, { id: 2 }];
      evaluationService.getAllEvaluations.mockResolvedValue(evaluations);

      req.query = { page: 1 };

      await getAllEvaluationsController(req, res);

      expect(evaluationService.getAllEvaluations).toHaveBeenCalledWith({ page: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(evaluations);
    });

    it('should handle error on getAll', async () => {
      evaluationService.getAllEvaluations.mockRejectedValue(new Error('DB error'));

      await getAllEvaluationsController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  describe('getEvaluationDetailsController', () => {
    it('should return evaluation details', async () => {
      const evalDetail = { id: 1, titre: 'DS1' };
      evaluationService.getEvaluationDetails.mockResolvedValue(evalDetail);

      req.params = { id: 1 };

      await getEvaluationDetailsController(req, res);

      expect(evaluationService.getEvaluationDetails).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(evalDetail);
    });

    it('should handle 404 error', async () => {
      evaluationService.getEvaluationDetails.mockRejectedValue(new Error('Not found'));

      req.params = { id: 99 };

      await getEvaluationDetailsController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('updateEvaluationController', () => {
    it('should update evaluation', async () => {
      const updated = { id: 1, titre: 'DS2' };
      evaluationService.updateEvaluation.mockResolvedValue(updated);

      req.params = { id: 1 };
      req.body = { titre: 'DS2' };

      await updateEvaluationController(req, res);

      expect(evaluationService.updateEvaluation).toHaveBeenCalledWith(1, { titre: 'DS2' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should handle error on update', async () => {
      evaluationService.updateEvaluation.mockRejectedValue(new Error('Invalid update'));

      req.params = { id: 1 };
      req.body = { titre: '' };

      await updateEvaluationController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid update' });
    });
  });

  describe('deleteEvaluationController', () => {
    it('should delete evaluation', async () => {
      evaluationService.deleteEvaluation.mockResolvedValue({ success: true });

      req.params = { id: 1 };

      await deleteEvaluationController(req, res);

      expect(evaluationService.deleteEvaluation).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should handle error on delete', async () => {
      evaluationService.deleteEvaluation.mockRejectedValue(new Error('Delete failed'));

      req.params = { id: 1 };

      await deleteEvaluationController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Delete failed' });
    });
  });

  describe('getStudentEvaluationsController', () => {
    it('should get student evaluations', async () => {
      const mockEvaluations = [{ id: 1 }, { id: 2 }];
      evaluationService.getStudentEvaluations.mockResolvedValue(mockEvaluations);

      req.params = { CNE: 'CNE123' };
      req.query = { semestre: 2 };

      await getStudentEvaluationsController(req, res);

      expect(evaluationService.getStudentEvaluations).toHaveBeenCalledWith('CNE123', { semestre: 2 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvaluations);
    });

    it('should handle error on get student evaluations', async () => {
      evaluationService.getStudentEvaluations.mockRejectedValue(new Error('DB failed'));

      req.params = { CNE: 'CNE123' };

      await getStudentEvaluationsController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB failed' });
    });
  });
});
