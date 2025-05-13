import {
  createEvaluation,
  getAllEvaluations,
  getEvaluationDetails,
  updateEvaluation,
  deleteEvaluation,
  getStudentEvaluations
} from '../services/EvaluationService.js';

export const createEvaluationController = async (req, res) => {
  try {
    const evaluation = await createEvaluation(req.body, req.user.id);
    res.status(201).json(evaluation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllEvaluationsController = async (req, res) => {
  try {
    const evaluations = await getAllEvaluations(req.query);
    res.status(200).json(evaluations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEvaluationDetailsController = async (req, res) => {
  try {
    const evaluation = await getEvaluationDetails(req.params.id);
    res.status(200).json(evaluation);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateEvaluationController = async (req, res) => {
  try {
    const updated = await updateEvaluation(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteEvaluationController = async (req, res) => {
  try {
    const result = await deleteEvaluation(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getStudentEvaluationsController = async (req, res) => {
  try {
    const evaluations = await getStudentEvaluations(req.params.CNE, req.query);
    res.status(200).json(evaluations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
