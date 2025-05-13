import {
  Evaluation,
  Indicateur,
  Baser,
  Competence,
  Utilisateur,
} from '../sync.js';

import sequelize from '../config/db.js';
import Sequelize from 'sequelize';
const { Op } = Sequelize;

export const createEvaluation = async (evaluationData, evaluatorId) => {
  const { date, commentaire, type, note, CNE, indicateurIds } = evaluationData;
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // 1. Récupérer les indicateurs avec leurs compétences associées
  const indicateurs = await Indicateur.findAll({
    where: {
      Id_I: indicateurIds,
    },
    include: [{
      model: Competence,
      as: 'competence',
      required: true
    }]
  });

  if (indicateurs.length !== indicateurIds.length) {
    const missingIds = indicateurIds.filter(id => 
      !indicateurs.some(ind => ind.Id_I === id)
    );
    throw new Error(
      `Indicateurs non trouvés: ${missingIds.join(', ')}`
    );
  }

  // 2. Vérifier les évaluations existantes pour ces compétences
  const competenceIds = [...new Set(indicateurs.map(ind => ind.competence.Id_C))];
  
  const existingEvaluations = await Evaluation.findAll({
    where: {
      CNE,
      Id_U: evaluatorId,
      date: {
        [Op.and]: [
          { [Op.gte]: firstDay },
          { [Op.lte]: lastDay }
        ]
      }
    },
    include: [{
      model: Baser,
      as: 'baser',
      where: {
        Id_C: {
          [Op.in]: competenceIds
        }
      },
      required: true
    }]
  });

  if (existingEvaluations.length > 0) {
    const competencesEvaluees = await Competence.findAll({
      where: {
        Id_C: {
          [Op.in]: [...new Set(existingEvaluations.flatMap(evalu => 
            evalu.baser.map(base => base.Id_C)
          ))]
        }
      },
      attributes: ['Id_C', 'nom']
    });
    
    throw new Error(
      `Évaluations existantes pour les compétences: ${
        competencesEvaluees.map(c => c.nom).join(', ')
      }`
    );
  }

  // 3. Créer la nouvelle évaluation
  const transaction = await sequelize.transaction();
  
  try {
    const evaluation = await Evaluation.create({
      date: date || new Date(),
      commentaire,
      type,
      note,
      CNE,
      Id_U: evaluatorId,
    }, { transaction });

    // 4. Créer les entrées dans Baser
    const baseEntries = indicateurs.map(indicateur => ({
      Id_I: indicateur.Id_I,
      Id_C: indicateur.competence.Id_C,
      Id_eval: evaluation.Id_eval
    }));

    await Baser.bulkCreate(baseEntries, { transaction });

    await transaction.commit();

    // 5. Récupérer l'évaluation complète avec ses relations
    const completeEvaluation = await Evaluation.findByPk(evaluation.Id_eval, {
      include: [
        {
          model: Baser,
          as: 'baser',
          include: [
            {
              model: Indicateur,
              as: 'indicateur',
              attributes: ['Id_I', 'description']
            },
            {
              model: Competence,
              as: 'competence',
              attributes: ['Id_C', 'nom']
            }
          ]
        },
        {
          model: Utilisateur,
          as: 'evaluateur',
          attributes: ['Id_U', 'nom', 'prenom']
        }
      ]
    });

    return completeEvaluation;

  } catch (error) {
    await transaction.rollback();
    throw new Error(`Erreur lors de la création de l'évaluation: ${error.message}`);
  }
};

export const getAllEvaluations = async (filters = {}) => {
  const whereClause = {};
  
  // Filtres optionnels
  if (filters.CNE) whereClause.CNE = filters.CNE;
  if (filters.type) whereClause.type = filters.type;
  if (filters.dateFrom || filters.dateTo) {
    whereClause.date = {};
    if (filters.dateFrom) whereClause.date[Op.gte] = new Date(filters.dateFrom);
    if (filters.dateTo) whereClause.date[Op.lte] = new Date(filters.dateTo);
  }

  const evaluations = await Evaluation.findAll({
    where: whereClause,
    include: [
      {
        model: Baser,
        as: 'baser',
        include: [
          {
            model: Indicateur,
            as: 'indicateur',
            attributes: ['Id_I', 'description']
          },
          {
            model: Competence,
            as: 'competence',
            attributes: ['Id_C', 'nom']
          }
        ]
      },
      {
        model: Utilisateur,
        as: 'evaluateur',
        attributes: ['Id_U', 'nom', 'prenom']
      }
    ],
    order: [['date', 'DESC']]
  });

  return evaluations;
};

export const getEvaluationDetails = async (evaluationId) => {
  const evaluation = await Evaluation.findByPk(evaluationId, {
    include: [
      {
        model: Baser,
        as: 'baser',
        include: [
          {
            model: Indicateur,
            as: 'indicateur',
            attributes: ['Id_I', 'description']
          },
          {
            model: Competence,
            as: 'competence',
            attributes: ['Id_C', 'nom']
          }
        ]
      },
      {
        model: Utilisateur,
        as: 'evaluateur',
        attributes: ['Id_U', 'nom', 'prenom']
      }
    ]
  });

  if (!evaluation) {
    throw new Error('Évaluation non trouvée');
  }

  return evaluation;
};

export const updateEvaluation = async (evaluationId, updateData) => {
  const transaction = await sequelize.transaction();
  
  try {
    const evaluation = await Evaluation.findByPk(evaluationId, {
      include: [{
        model: Baser,
        as: 'baser'
      }],
      transaction
    });

    if (!evaluation) {
      throw new Error('Évaluation non trouvée');
    }

    // Mise à jour des champs de base
    await evaluation.update(updateData, { transaction });

    // Mise à jour des indicateurs si fournis
    if (updateData.indicateurIds) {
      // 1. Récupérer les nouveaux indicateurs
      const newIndicateurs = await Indicateur.findAll({
        where: {
          Id_I: updateData.indicateurIds,
        },
        include: [{
          model: Competence,
          as: 'competence',
          required: true
        }],
        transaction
      });

      if (newIndicateurs.length !== updateData.indicateurIds.length) {
        throw new Error('Un ou plusieurs indicateurs sont invalides');
      }

      // 2. Supprimer les anciennes relations Baser
      await Baser.destroy({
        where: {
          Id_eval: evaluation.Id_eval
        },
        transaction
      });

      // 3. Créer les nouvelles relations
      const baseEntries = newIndicateurs.map(indicateur => ({
        Id_I: indicateur.Id_I,
        Id_C: indicateur.competence.Id_C,
        Id_eval: evaluation.Id_eval
      }));

      await Baser.bulkCreate(baseEntries, { transaction });
    }

    await transaction.commit();
    
    // Retourner l'évaluation mise à jour avec ses relations
    return await getEvaluationDetails(evaluationId);

  } catch (error) {
    await transaction.rollback();
    throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
  }
};

export const deleteEvaluation = async (evaluationId) => {
  const transaction = await sequelize.transaction();
  
  try {
    const evaluation = await Evaluation.findByPk(evaluationId, { transaction });

    if (!evaluation) {
      throw new Error('Évaluation non trouvée');
    }

    // La suppression en cascade s'occupe des entrées Baser associées
    await evaluation.destroy({ transaction });

    await transaction.commit();
    
    return { 
      success: true,
      message: 'Évaluation supprimée avec succès' 
    };

  } catch (error) {
    await transaction.rollback();
    throw new Error(`Erreur lors de la suppression: ${error.message}`);
  }
};

export const getStudentEvaluations = async (CNE, filters = {}) => {
  const whereClause = { CNE };
  
  if (filters.type) whereClause.type = filters.type;
  if (filters.dateFrom || filters.dateTo) {
    whereClause.date = {};
    if (filters.dateFrom) whereClause.date[Op.gte] = new Date(filters.dateFrom);
    if (filters.dateTo) whereClause.date[Op.lte] = new Date(filters.dateTo);
  }

  const evaluations = await Evaluation.findAll({
    where: whereClause,
    include: [
      {
        model: Baser,
        as: 'baser',
        include: [
          {
            model: Indicateur,
            as: 'indicateur',
            attributes: ['Id_I', 'description']
          },
          {
            model: Competence,
            as: 'competence',
            attributes: ['Id_C', 'nom']
          }
        ]
      },
      {
        model: Utilisateur,
        as: 'evaluateur',
        attributes: ['Id_U', 'nom', 'prenom']
      }
    ],
    order: [['date', 'DESC']]
  });

  return evaluations;
};