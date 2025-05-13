import { Indicateur, Competence } from '../sync.js';

export const createIndicateur = async (data) => {
  const { libelle, description, Id_C } = data;

  // Vérifie que la compétence existe
  const competence = await Competence.findByPk(Id_C);
  if (!competence) {
    throw new Error('Compétence non trouvée');
  }

  // Créer l'indicateur lié à la compétence
  return await Indicateur.create({
    libelle,
    description,
    Id_C,
  });
};

/*Pour le test postman
{
  "nom": "Prise d'initiative",
  "description": "Capacité à proposer et démarrer des idées sans être poussé",
  "Id_C": 3
}
*/

export const getAllIndicateurs = async () => {
  return await Indicateur.findAll({
    include: {
      model: Competence,
      as: 'competence',
      attributes: ['Id_C', 'nom'],
    },
  });
};

export const getIndicateursByCompetence = async (competenceId) => {
  return await Indicateur.findAll({
    where: { Id_C: competenceId },
    include: {
      model: Competence,
      as: 'competence',
      attributes: ['Id_C', 'nom'],
    },
  });
};

export const updateIndicateur = async (Id_I, data) => {
  const indicateur = await Indicateur.findByPk(Id_I);
  if (!indicateur) throw new Error('Indicateur non trouvé');

  await indicateur.update(data);
  return indicateur;
};

export const deleteIndicateur = async (Id_I) => {
  const indicateur = await Indicateur.findByPk(Id_I);
  if (!indicateur) throw new Error('Indicateur non trouvé');

  await indicateur.destroy();
  return { message: 'Indicateur supprimé avec succès' };
};
