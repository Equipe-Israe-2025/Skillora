import {
  createSolutionService,
  getAllSolutionsService,
  deleteSolutionService,
  updateSolutionService
} from '../services/solutionService.js';

export async function createSolution(req, res) {
  try {
    const solution = await createSolutionService(req.body);
    res.status(201).json({
      message: 'Solution créée et liée au signalement avec succès.',
      solution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAllSolutions(req, res) {
  try {
    const solutions = await getAllSolutionsService();
    res.status(200).json(solutions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteSolution(req, res) {
  try {
    await deleteSolutionService(req.params.id);
    res.status(200).json({ message: 'Solution et liens supprimés avec succès.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateSolution(req, res) {
  try {
    const solution = await updateSolutionService(req.params.id, req.body);
    res.status(200).json({ message: 'Solution mise à jour avec succès.', solution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
