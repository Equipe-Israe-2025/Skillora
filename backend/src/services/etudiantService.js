import { Etudiant, Utilisateur, Filiere ,Forme, Groupe, Encadrant } from '../sync.js';


export const getProfilEtudiant = async (userId) => {
  const etudiant = await Etudiant.findOne({
    where: { Id_U: userId },
    include: [
      {
        model: Utilisateur,
        as: 'utilisateur',  // attention au alias "as" que tu as utilisé dans le modèle
        attributes: ['nom', 'prenom', 'email', 'image', 'role', 'taux']
      },
      {
        model: Filiere,
        as: 'filiere',
        attributes: ['Id_F', 'nom_filiere','nbr_Etud','Volume_horaire','chef_filiere','description'] 
      }
    ]
  });
  return etudiant;
};

//fct pour recuperer tous les grps 
export const getMesGroupes = async (userId) => {
    // Récupérer le CNE de l'étudiant connecté
    const etudiant = await Etudiant.findOne({ where: { Id_U: userId } });
  
    if (!etudiant) {
      throw new Error('Etudiant non trouvé');
    }
  
    const groupes = await Forme.findAll({
      where: { CNE: etudiant.CNE },
      include: [{
        model: Groupe,
        as: 'groupe',   // attention à bien mettre le bon alias
        attributes: ['Id_G', 'nom_Groupe']
      }]
    });
  
    return groupes.map(g => g.groupe); // retourner juste les groupes
};

//Fonction pour voir les détails d'un groupe sélectionné
export const getDetailsGroupe = async (groupeId) => {
    const formes = await Forme.findAll({
      where: { Id_G: groupeId },
      include: [
        {
          model: Encadrant,
          as: 'encadrant',
          include: [{
            model: Utilisateur,
            as: 'utilisateur',
            attributes: ['nom', 'prenom']
          }]
        },
        {
          model: Etudiant,
          as: 'etudiant',
          include: [{
            model: Utilisateur,
            as: 'utilisateur',
            attributes: ['nom', 'prenom']
          }]
        }
      ]
    });
  
    if (formes.length === 0) {
      return null;
    }
  
    // Encadrant est le même pour tout le groupe, donc on le prend depuis le premier enregistrement
    const encadrant = formes[0].encadrant;
  
    // Tous les étudiants du groupe
    const etudiants = formes.map(f => f.etudiant);
  
    return {
      encadrant,
      etudiants
    };
};
  
  