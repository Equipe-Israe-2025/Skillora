import { Etudiant, Forme, Groupe, Encadrant,Utilisateur , Filiere} from '../sync.js';
import Sequelize from 'sequelize';
const { Op } = Sequelize;


 //les infos d un encadrant
export const getProfilEncadrant = async (userId) => {
  const encadrant = await Encadrant.findOne({
    where: { Id_U: userId },
    include: [
      {
        model: Utilisateur,
        as: 'utilisateur',
        attributes: ['nom', 'prenom', 'email', 'image', 'role'] 
      }
    ]
  });

  if (!encadrant) {
    throw new Error('Encadrant non trouvé');
  }

  return encadrant;
};


export const getFilieresByEncadrant = async (numSum) => {
    try {
      const enseignes = await db.Enseigne.findAll({
        where: { Num_sum: numSum },
        include: [{
          model: db.Filiere,
          as: 'filiere',
        }],
      });
  
      const filieres = enseignes.map(ens => ens.filiere);
  
      return filieres;
    } catch (error) {
      console.error('Erreur dans le service getFilieresByEncadrant:', error);
      throw error;
    }
  };
// Service pour récupérer les étudiants d'une filièr
export const getEtudiantsByFiliere = async (idFiliere) => {
  const etudiants = await Etudiant.findAll({
    where: { Id_F: idFiliere },
    include: [
      {
        association: 'utilisateur',
        attributes: ['nom', 'prenom', 'email', 'image']
      }
    ]
  });
  return etudiants;
};

// Service pour récupérer les informations d'une filière
export const getFiliereInfo = async (idFiliere) => {
    const filiere = await Filiere.findOne({
      where: { Id_F: idFiliere },
      attributes: ['Id_F', 'nom_filiere', 'nbr_Etud', 'Volume_horaire','chef_filiere', 'description']
    });
    return filiere;
  };

//seulement kataffichy les grps li kaycreehim wa7d l encadrant avec la liste des etudiants li kayfomiw had les grps 
export const getGroupesByEncadrant = async (numSum) => {
  const groupes = await Forme.findAll({
    where: { Num_sum: numSum },
    include: [
      {
        association: 'groupe',
      },
      {
        association: 'etudiant',
        include: {
          association: 'utilisateur',
          attributes: ['nom', 'prenom', 'email', 'image']
        }
      }
    ],
    order: [['Id_G', 'ASC']]
  });

  // Regrouper les étudiants par groupe
  const groupesRegroupes = {};

  groupes.forEach(item => {
    const groupeId = item.Id_G;
    if (!groupesRegroupes[groupeId]) {
      groupesRegroupes[groupeId] = {
        groupe: item.groupe,
        etudiants: []
      };
    }
    groupesRegroupes[groupeId].etudiants.push(item.etudiant);
  });

  return Object.values(groupesRegroupes);
};

//cree groupe t kataffecter fih une liste des etudiants
export const createGroupeAvecEtudiants = async (numSum, nomGroupe, cneList) => {
  const currentYear = new Date().getFullYear(); // année automatique

  const newGroupe = await Groupe.create({
    NomProjet: nomGroupe,
    Annee: currentYear
  });

  const idGroupe = newGroupe.Id_G;

  const creations = cneList.map(cne => ({
    Num_sum: numSum,
    Id_G: idGroupe,
    CNE: cne
  }));

  await Forme.bulkCreate(creations);
};

//had les service li jayin kamli mn b3d voici scenario dyalhom pour que la liaison soit facile pour vous
/* Quand tu cliques sur un groupe :
Tu vois la liste des étudiants du groupe.
Trois boutons disponibles :
Modifier le nom ➔ j'écris le nouveau nom ➔ je valide ➔ update en base de données.
Supprimer étudiant(s) ➔ je choisis des étudiants parmi ceux du groupe ➔ je valide ➔ delete en base de données.
Ajouter étudiant(s) ➔ je vois la liste des étudiants de la même filière NON encore dans ce groupe ➔ je choisis ➔ je valide ➔ insert en base de données.*/

export const modifierNomGroupe = async (idGroupe, nouveauNom) => {
  return await Groupe.update(
    { NomProjet: nouveauNom },
    { where: { Id_G: idGroupe } }
  );
};

export const supprimerEtudiantsDuGroupe = async (idGroupe, listeCNE) => {
  return await Forme.destroy({
    where: {
      Id_G: idGroupe,
      CNE: listeCNE
    }
  });
};

export const ajouterEtudiantsAuGroupe = async (idGroupe, listeCNE, numSomme) => {
  const ajouts = listeCNE.map(cne => ({
    Num_Somme: numSomme,
    Id_G: idGroupe,
    CNE: cne
  }));

  return await Forme.bulkCreate(ajouts);
};

export const getEtudiantsDansGroupe = async (idGroupe) => {
  return await Forme.findAll({
    where: { Id_G: idGroupe },
    include: [{ model: Etudiant }]
  });
};


export const getEtudiantsHorsGroupe = async (idGroupe, idFiliere) => {
  const etudiantsDansGroupe = await Forme.findAll({
    attributes: ['CNE'],
    where: { Id_G: idGroupe }
  });
  
  const CNEsDansGroupe = etudiantsDansGroupe.map(e => e.CNE);

  return await Etudiant.findAll({
    where: {
      Filiere: idFiliere,
      CNE: {
        [Op.notIn]: CNEsDansGroupe
      }
    }
  });
};
