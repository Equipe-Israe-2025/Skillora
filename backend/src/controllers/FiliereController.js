import {
  createFiliere,
  updateFiliere,
  deleteFiliere
} from '../services/FiliereService.js';

export const create = async (req, res) => {
  try {
    const filiere = await createFiliere(req.body);
    res.status(201).json(filiere);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await updateFiliere(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const supprimer = async (req, res) => {
  try {
    const result = await deleteFiliere(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
