export default  (sequelize, DataTypes) => {
  const Evaluation = sequelize.define('Evaluation', {
    Id_eval: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    commentaire: {
      type: DataTypes.TEXT,
      allowNull: true
    }, 
    type: {
      type: DataTypes.ENUM('auto_eval', 'tuteur', 'pair', 'professeur'),
      allowNull: false
    },
    note: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 5
      }
    },
    Id_U: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Utilisateur',
        key: 'Id_U'
      }
    },
    CNE: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Etudiant',
        key: 'CNE'
      }
    },
    anonyme: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'Evaluation',
    timestamps: true,
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['CNE', 'Id_U', 'date'], // empêche une double évaluation identique dans la même période
        name: 'unique_eval_per_period'
      }
    ]
  });

  Evaluation.associate = (models) => {
    Evaluation.belongsTo(models.Utilisateur, { 
      foreignKey: 'Id_U',
      as: 'evaluateur'
    });
    Evaluation.belongsTo(models.Etudiant, { 
      foreignKey: 'CNE',
      as: 'etudiant'
    });
    Evaluation.hasMany(models.Baser, { 
      foreignKey: {
        name: 'Id_eval',
        allowNull: false
      },
      as: 'baser'
    });

  };

  // Hook pour la notification après évaluation
  Evaluation.afterCreate(async (evaluation, options) => {
    try {
      const etudiant = await sequelize.models.Etudiant.findOne({
        where: { CNE: evaluation.CNE },
        include: [{
          model: sequelize.models.Utilisateur,
          as: 'utilisateur'
        }]
      });
  
      if (etudiant && etudiant.utilisateur) {
        let evaluateur = "un système";
        if (!evaluation.anonyme) {
          const utilisateur = await sequelize.models.Utilisateur.findByPk(evaluation.Id_U);
          if (utilisateur) {
            evaluateur = `un ${utilisateur.role.toLowerCase()}`;
          }
        } else {
          evaluateur = "un évaluateur anonyme";
        }
  
        await sequelize.models.Notification.create({
          titre: "Nouvelle évaluation",
          contenu: `Vous avez été évalué par ${evaluateur}. Note: ${evaluation.note}/5. ${evaluation.commentaire ? 'Commentaire: ' + evaluation.commentaire : ''}`,
          lu: false,
          date: new Date(),
          Id_U: etudiant.utilisateur.Id_U  // On récupère l'Id_U du profil utilisateur lié
        });
      }
    } catch (error) {
      console.error("Erreur création notification évaluation:", error);
    }
  });
  

  return Evaluation;
};