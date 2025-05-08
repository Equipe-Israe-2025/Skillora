export default  (sequelize, DataTypes) => {
  const Signalement = sequelize.define('Signalement', {
    Id_S: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    Id_U: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CNE: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Signalement',
    timestamps: false
  });

  Signalement.associate = (models) => {
    Signalement.belongsTo(models.Utilisateur, { foreignKey: 'Id_U' });
    Signalement.belongsTo(models.Etudiant, { foreignKey: 'CNE' });
    Signalement.hasMany(models.Proposer, { foreignKey: 'Id_S' });
  };

  // Hook après création d'un signalement
  Signalement.afterCreate(async (signalement, options) => {
    try {
      // Récupérer l'étudiant concerné et l'auteur du signalement
      const [etudiant, auteur] = await Promise.all([
        sequelize.models.Etudiant.findOne({
          where: { CNE: signalement.CNE },
          include: [
            {
              model: sequelize.models.Utilisateur,
              as: 'utilisateur'  
            }
          ]
        }),
        sequelize.models.Utilisateur.findByPk(signalement.Id_U)
      ]);

      if (etudiant && auteur) {
        // Déterminer le type d'auteur
        let typeAuteur = "";
        switch(auteur.role) {
          case 'Encadrant':
            typeAuteur = "votre encadrant";
            break;
          case 'Tuteur':
            typeAuteur = "votre tuteur";
            break;
          case 'Administrateur':
            typeAuteur = "l'administration";
            break;
          case 'Etudiant':
            typeAuteur = "un autre étudiant";
            break;
          default:
            typeAuteur = "un membre de l'équipe";
        }
  
        // Créer la notification avec un message plus précis
        await sequelize.models.Notification.create({
          titre: "Nouveau signalement",
          contenu: `Vous avez été signalé par ${typeAuteur} (${auteur.prenom} ${auteur.nom}) pour: ${signalement.description}. Veuillez consulter l'administration pour plus d'informations.`,
          lu: false,
          date: new Date(),
          Id_U: etudiant.utilisateur.Id_U
        });
      }  
    } catch (error) {
      console.error("Erreur lors de la création de la notification:", error);
    }
  });

  return Signalement;
};