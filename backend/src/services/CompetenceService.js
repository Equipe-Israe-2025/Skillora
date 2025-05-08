import { Competence } from '../sync.js';
import { Indicateur } from '../sync.js';

export const createCompetence = async (data) => {
  const { Id_C, nom, description } = data;
  const competence = await Competence.create({ Id_C, nom, description });
  return competence;
};

export const getAllCompetences = async () => {
  const competences = await Competence.findAll({
    attributes: ['Id_C', 'nom'], // juste l'id et le nom pour l'affichage simple
  });
  return competences;
};

export const getCompetenceById = async (Id_C) => {
  const competence = await Competence.findOne({
    where: { Id_C },
    include: [
      {
        model: Indicateur,
        attributes: ['Id_C', 'libelle'], // on veut afficher les indicateurs liés
      },
    ],
  });

  if (!competence) {
    throw new Error('Compétence non trouvée');
  }

  return competence;
}; // l'orsque je clique a une competence ds front je trouve le detail de la cometence

export async function updateCompetence(Id_C, data) {
  const competence = await Competence.findByPk(Id_C);
  if (!competence) throw new Error('Competence not found');
  return await competence.update(data);
}

export const deleteCompetence = async (Id_C) => {
  const competence = await Competence.findByPk(Id_C);

  if (!competence) {
    throw new Error('Compétence non trouvée');
  }

  await competence.destroy();
  return { message: 'Compétence supprimée avec succès' };
};
