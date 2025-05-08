import { Signalement } from '../sync.js';

export async function createSignalementService({ description, CNE, Id_U }) {
  return await Signalement.create({ description, Id_U, CNE });
}

export async function getAllSignalementsService() {
  return await Signalement.findAll();
}

export async function deleteSignalementService(id) {
  const deleted = await Signalement.destroy({ where: { Id_S: id } });
  if (!deleted) {
    throw new Error('Signalement non trouvé.');
  }
  return deleted;
}
