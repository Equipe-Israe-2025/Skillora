import {
  Badge,
  Evaluation,
  Utilisateur,
  Competence,
  Indicateur,
} from '../sync.js';
import { createPDF } from './pdfService.js';

export const generateBadge = async (evaluationId) => {
  const Eval = await Evaluation.findByPk(evaluationId, {
    include: [
      { model: Utilisateur, as: 'evaluateur' },
      { model: Utilisateur, as: 'evalue' },
      {
        model: Indicateur,
        include: [Competence],
      },
    ],
  });       

  if (!Eval) throw new Error('Évaluation non trouvée');
  if (Eval.note < 4) throw new Error('Note insuffisante pour un badge');

  const badgeData = {
    studentName: `${Eval.evalue.nom} ${Eval.evalue.prenom}`,
    competence: Eval.Indicateur.Competence.nom,
    note: Eval.note,
    commentaire: Eval.commentaire,
    evaluateur: `${Eval.evaluateur.nom} ${Eval.evaluateur.prenom}`,
    date: Eval.createdAt.toDateString(),
  };

  const pdfPath = await createPDF(badgeData); // fichier temporaire ou permanent

  const badge = await Badge.create({
    nom: `Badge - ${badgeData.competence}`,
    lien: pdfPath,
    id_evaluation: Eval.id,
  });

  return badge;
};

export const getBadgeByEvaluation = async (evaluationId) => {
  return await Badge.findOne({ where: { id_evaluation: evaluationId } });
};

export const downloadBadge = async (badgeId) => {
  const badge = await Badge.findByPk(badgeId);
  if (!badge) throw new Error('Badge non trouvé');
  return badge.lien;
};
