import { Tuteur, Etudiant, Utilisateur } from '../sync.js';

export const getEtudiantsParTuteur = async (idTuteur) => {
  const etudiants = await Etudiant.findAll({
    where: { id_tuteur: idTuteur },
    include: [
      {
        model: Utilisateur,
        as: 'utilisateur',
      },
    ],
  });
  return etudiants;
};
