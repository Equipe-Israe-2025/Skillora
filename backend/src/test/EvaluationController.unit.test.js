import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createEvaluationController,
  getAllEvaluationsController,
  getEvaluationDetailsController,
  updateEvaluationController,
  deleteEvaluationController,
  getStudentEvaluationsController
} from './EvaluationController.js';

import * as EvaluationService from '../services/EvaluationService.js';

// Mock les fonctions du service
vi.mock('../services/EvaluationService.js', () => ({
  createEvaluation: vi.fn(),
  getAllEvaluations: vi.fn(),
  getEvaluationDetails: vi.fn(),
  updateEvaluation: vi.fn(),
  deleteEvaluation: vi.fn(),
  getStudentEvaluations: vi.fn()
}));

describe('EvaluationController (unit)', () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: 'USER1' }
    };
    res = {
      status: vi.fn(() => res),
      json: vi.fn()
    };
  });

  it('createEvaluationController - succès', async () => {
    const fakeEval = { id: 1, titre: 'Exam' };
    EvaluationService.createEvaluation.mockResolvedValue(fakeEval);

    req.body = { titre: 'Exam' };

    await createEvaluationController(req, res);

    expect(EvaluationService.createEvaluation).toHaveBeenCalledWith(req.body, 'USER1');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeEval);
  });

  it('createEvaluationController - échec', async () => {
    EvaluationService.createEvaluation.mockRejectedValue(new Error('Erreur création'));

    await createEvaluationController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur création' });
  });

  it('getAllEvaluationsController - succès', async () => {
    const list = [{ id: 1 }, { id: 2 }];
    EvaluationService.getAllEvaluations.mockResolvedValue(list);

    await getAllEvaluationsController(req, res);

    expect(EvaluationService.getAllEvaluations).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(list);
  });

  it('getAllEvaluationsController - échec', async () => {
    EvaluationService.getAllEvaluations.mockRejectedValue(new Error('Erreur DB'));

    await getAllEvaluationsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur DB' });
  });

  it('getEvaluationDetailsController - succès', async () => {
    const details = { id: 1, titre: 'Exam' };
    EvaluationService.getEvaluationDetails.mockResolvedValue(details);
    req.params = { id: 1 };

    await getEvaluationDetailsController(req, res);

    expect(EvaluationService.getEvaluationDetails).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(details);
  });

  it('getEvaluationDetailsController - erreur', async () => {
    EvaluationService.getEvaluationDetails.mockRejectedValue(new Error('Not found'));
    req.params = { id: 999 };

    await getEvaluationDetailsController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
  });

  it('updateEvaluationController - succès', async () => {
    const updated = { id: 1, titre: 'Updated' };
    EvaluationService.updateEvaluation.mockResolvedValue(updated);
    req.params = { id: 1 };
    req.body = { titre: 'Updated' };

    await updateEvaluationController(req, res);

    expect(EvaluationService.updateEvaluation).toHaveBeenCalledWith(1, { titre: 'Updated' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('updateEvaluationController - erreur', async () => {
    EvaluationService.updateEvaluation.mockRejectedValue(new Error('Update failed'));
    req.params = { id: 1 };

    await updateEvaluationController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
  });

  it('deleteEvaluationController - succès', async () => {
    EvaluationService.deleteEvaluation.mockResolvedValue({ success: true });
    req.params = { id: 1 };

    await deleteEvaluationController(req, res);

    expect(EvaluationService.deleteEvaluation).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('deleteEvaluationController - erreur', async () => {
    EvaluationService.deleteEvaluation.mockRejectedValue(new Error('Delete error'));
    req.params = { id: 1 };

    await deleteEvaluationController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Delete error' });
  });

  it('getStudentEvaluationsController - succès', async () => {
    const evals = [{ id: 1 }];
    EvaluationService.getStudentEvaluations.mockResolvedValue(evals);
    req.params = { CNE: 'CNE123' };

    await getStudentEvaluationsController(req, res);

    expect(EvaluationService.getStudentEvaluations).toHaveBeenCalledWith('CNE123', req.query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(evals);
  });

  it('getStudentEvaluationsController - erreur', async () => {
    EvaluationService.getStudentEvaluations.mockRejectedValue(new Error('Fail'));
    req.params = { CNE: 'CNE123' };

    await getStudentEvaluationsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Fail' });
  });
});
