import { Enseigne, Encadrant, Filiere } from '../sync.js';

// Affecter des filières à un encadrant
export const affecterFilieresAEncadrant = async (numSum, listeIdFiliere) => {
  try {
    // Vérifier l'existence de l'encadrant
    const encadrant = await Encadrant.findOne({ where: { Num_sum: numSum } });
    if (!encadrant) {
      throw new Error('Encadrant non trouvé.');
    }

    // Créer les associations
    const liaisons = listeIdFiliere.map(idF => ({
      Num_sum: numSum,
      Id_F: idF
    }));

    await Enseigne.bulkCreate(liaisons);
    return { message: 'Filières affectées avec succès.' };
  } catch (error) {
    throw error;
  }
};

// Récupérer les filières d'un encadrant
export const getFilieresByEncadrant = async (numSum) => {
  try {
    const enseignes = await Enseigne.findAll({
      where: { Num_sum: numSum },
      include: [{ model: Filiere, as: 'filiere' }]
    });

    return enseignes.map(ens => ens.filiere);
  } catch (error) {
    throw error;
  }
};

// Supprimer une filière d’un encadrant
export const retirerFiliereAEncadrant = async (numSum, idFiliere) => {
  try {
    const deleted = await Enseigne.destroy({
      where: {
        Num_sum: numSum,
        Id_F: idFiliere
      }
    });
    if (!deleted) {
      throw new Error("Association non trouvée.");
    }
    return { message: "Filière retirée avec succès." };
  } catch (error) {
    throw error;
  }
};