import {
  createCompetence,
  getAllCompetences,
  getCompetenceById,
  updateCompetence,
  deleteCompetence,
} from '../services/CompetenceService.js';

export async function create(req, res) {
  try {
    const competence = await createCompetence(req.body);
    res.status(201).json(competence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAll(req, res) {
  try {
    const competences = await getAllCompetences();
    res.status(200).json(competences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const competence = await getCompetenceById(req.params.id);
    if (!competence)
      return res.status(404).json({ error: 'Competence not found' });
    res.status(200).json(competence);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const competence = await updateCompetence(req.params.id, req.body);
    res.status(200).json(competence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function removeComp(req, res) {
  try {
    const { id } = req.params;
    const result = await deleteCompetence(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
