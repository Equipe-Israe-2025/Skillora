import {
  createIndicateur,
  getAllIndicateurs,
  getIndicateursByCompetence,
  updateIndicateur,
  deleteIndicateur
} from '../services/IndicateurService.js';

export const create= async (req, res) => {
  try {
    const indicateur = await createIndicateur(req.body);
    res.status(201).json(indicateur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAll= async (req, res) => {
  try {
    const indicateurs = await getAllIndicateurs();
    res.json(indicateurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getIndicateursByComp = async (req, res) => {
  try {
    const indicateurs = await getIndicateursByCompetence(req.params.id);
    res.json(indicateurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update= async (req, res) => {
  try {
    const indicateur = await updateIndicateur(req.params.id, req.body);
    res.json(indicateur);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const supprimer = async (req, res) => {
  try {
    const result = await deleteIndicateur(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};