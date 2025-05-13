import {
  Solution_Proposee,
  Proposer
} from '../sync.js';

export async function createSolutionService({ type, nom, description, dateDebut, dateFin, Id_S }) {
  if (!Id_S) {
    throw new Error('Id_S (Signalement) est requis pour lier la solution.');
  }

  const newSolution = await Solution_Proposee.create({
    type,
    nom,
    description,
    dateDebut,
    dateFin,
  });

  await Proposer.create({
    Id_S: Id_S,
    Id_SP: newSolution.Id_SP,
  });

  return newSolution;
}

export async function getAllSolutionsService() {
  return await Solution_Proposee.findAll();
}

export async function deleteSolutionService(id) {
  await Proposer.destroy({ where: { Id_SP: id } });

  const deleted = await Solution_Proposee.destroy({ where: { Id_SP: id } });

  if (!deleted) {
    throw new Error('Solution non trouvée.');
  }

  return deleted;
}

export async function updateSolutionService(id, data) {
  const solution = await Solution_Proposee.findByPk(id);
  if (!solution) {
    throw new Error('Solution non trouvée.');
  }

  const fields = ['type', 'nom', 'description', 'dateDebut', 'dateFin'];
  for (const field of fields) {
    if (data[field] !== undefined) {
      solution[field] = data[field];
    }
  }

  await solution.save();
  return solution;
}
