import { Evaluation, Indicateur, Competence, Utilisateur, Baser } from '../sync.js';

export const getMoyenneParCompetence = async (Id_C = null) => {
    const evaluations = await Evaluation.findAll({
      include: [
        {
          model: Baser,
          as: 'baser',
          include: [
            {
              model: Indicateur,
              as: 'indicateur',
              include: [
                {
                  model: Competence,
                  as: 'competence',
                },
              ],
            },
          ],
        },
        {
          model: Utilisateur,
          as: 'evaluateur',
          attributes: ['Id_U', 'role', 'taux'],
        },
      ],
    });

    const moyennes = {};

    for (const evaluation of evaluations) {
      for (const baser of evaluation.baser) {
        const competence = baser.indicateur.competence;

        if (Id_C && competence.Id_C !== Id_C) continue; // Filtrer par compétence

        const competenceId = competence.Id_C;
        const competenceNom = competence.nom;
        const poids = evaluation.evaluateur.taux;
        const note = evaluation.note;

        if (!moyennes[competenceId]) {
          moyennes[competenceId] = {
            nom: competenceNom,
            totalNotePondérée: 0,
            totalPoids: 0,
          };
        }

        moyennes[competenceId].totalNotePondérée += note * poids;
        moyennes[competenceId].totalPoids += poids;
      }
    }

    const result = [];
    for (const id in moyennes) {
      const m = moyennes[id];
      result.push({
        competenceId: id,
        competenceNom: m.nom,
        moyenne: (m.totalNotePondérée / m.totalPoids).toFixed(2),
      });
    }

    return result;

};


// Génération du rappot par competénce
export const getRapportParCompetence = async (Id_C = null) => {
  const basers = await Baser.findAll({
    include: [
      {
        model: Evaluation,
        as: 'Evaluation',
        include: [
          {
            model: Utilisateur,
            as: 'evaluateur',
            attributes: ['Id_U', 'nom', 'role'],
          },
        ],
      },
      {
        model: Indicateur,
        as: 'indicateur',
        include: [
          {
            model: Competence,
            as: 'competence',
          },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  const rapport = {};

  for (const baser of basers) {
    const evaluation = baser.Evaluation;
    const competence = baser.indicateur.competence;

    if (Id_C && competence.Id_C !== Id_C) continue; // filtrer si une compétence est demandée

    const competenceNom = competence.nom;

    if (!rapport[competenceNom]) rapport[competenceNom] = [];

    rapport[competenceNom].push({
      indicateur: baser.indicateur.libelle,
      note: evaluation.note,
      commentaire: evaluation.commentaire,
      evaluateur: evaluation.evaluateur.nom,
      role: evaluation.evaluateur.role,
      date: evaluation.createdAt,
    });
  }

  return rapport;
};

// sigature ??
