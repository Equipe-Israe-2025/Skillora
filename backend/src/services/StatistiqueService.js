import { Evaluation, Indicateur, Competence, Utilisateur } from '../sync.js';

import { format } from 'date-fns';

// moyenne par competénce généralement
export const getMoyenneParCompetence = async () => {
  const evaluations = await Evaluation.findAll({
    include: [
      {
        model: Indicateur,
        include: [Competence],
      },
      {
        model: Utilisateur,
        attributes: ['id', 'taux'],
      },
    ],
  });

  const moyennes = {};

  for (const evaluation of evaluations) {
    const competenceId = evaluation.indicateur.competence.id;
    const competenceNom = evaluation.indicateur.competence.nom;
    const poids = evaluation.Utilisateur.taux; // Ex : 0.4
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

// moyenne monsuelle pour chaque competence

export const getMoyenneMensuelleParCompetence = async () => {
  const evaluations = await Evaluation.findAll({
    include: [
      {
        model: Indicateur,
        include: [Competence],
      },
      {
        model: Utilisateur,
        attributes: ['id', 'taux'],
      },
    ],
  });

  const result = {};

  for (const evaluation of evaluations) {
    const competence = evaluation.indicateur.competence;
    const competenceId = competence.id;
    const competenceNom = competence.nom;

    // Formater la date au format YYYY-MM
    const mois = format(new Date(evaluation.createdAt), 'yyyy-MM');

    const note = evaluation.note;
    const poids = evaluation.Utilisateur.taux;

    if (!result[competenceId]) {
      result[competenceId] = {
        nom: competenceNom,
        evolution: {}, // regroupement par mois
      };
    }

    if (!result[competenceId].evolution[mois]) {
      result[competenceId].evolution[mois] = {
        totalNotePondérée: 0,
        totalPoids: 0,
      };
    }

    result[competenceId].evolution[mois].totalNotePondérée += note * poids;
    result[competenceId].evolution[mois].totalPoids += poids;
  }

  // Préparer les résultats finaux
  const finalResult = [];

  for (const id in result) {
    const competenceData = result[id];
    const evolutionArray = [];

    for (const mois in competenceData.evolution) {
      const e = competenceData.evolution[mois];
      const moyenne = e.totalPoids
        ? (e.totalNotePondérée / e.totalPoids).toFixed(2)
        : 0;
      evolutionArray.push({
        mois,
        moyenne: parseFloat(moyenne),
      });
    }

    // Trier les mois dans l'ordre chronologique
    evolutionArray.sort((a, b) => new Date(a.mois) - new Date(b.mois));

    finalResult.push({
      competenceId: id,
      competenceNom: competenceData.nom,
      evolution: evolutionArray,
    });
  }

  return finalResult;
};

// Génération du rappot par competénce
export const getRapportParCompetence = async () => {
  const evaluations = await Evaluation.findAll({
    include: [
      {
        model: Indicateur,
        include: [Competence],
      },
      {
        model: Utilisateur,
        attributes: ['id', 'nom', 'role'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  const rapport = {};

  evaluations.forEach((evaluation) => {
    const comp = evaluation.indicateur.competence;
    if (!rapport[comp.nom]) rapport[comp.nom] = [];

    rapport[comp.nom].push({
      indicateur: evaluation.indicateur.nom,
      note: evaluation.note,
      commentaire: evaluation.commentaire,
      evaluateur: evaluation.Utilisateur.nom,
      role: evaluation.Utilisateur.role,
      date: evaluation.createdAt,
    });
  });

  return rapport;
};
// sigature ??