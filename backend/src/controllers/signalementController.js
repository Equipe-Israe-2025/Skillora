import { createSignalementService, getAllSignalementsService, deleteSignalementService } from '../services/signalementService.js';

export async function createSignalement(req, res) {
  const { description, CNE } = req.body;
  const Id_U = req.user.id;
  try {
    const newSignalement = await createSignalementService({ description, CNE, Id_U });
    res.status(201).json(newSignalement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAllSignalements(req, res) {
  try {
    const signalements = await getAllSignalementsService();
    res.status(200).json(signalements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteSignalement(req, res) {
  const { id } = req.params;
  try {
    await deleteSignalementService(id);
    res.status(200).json({ message: 'Signalement supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
