export default  (sequelize, DataTypes) => {
  const Filiere = sequelize.define('Filiere', {
    Id_F: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },
    nbr_Etud:{type:DataTypes.INTEGER},
    Volume_horaire:{type: DataTypes.INTEGER},
    chef_filiere:{type: DataTypes.STRING},
    description:{type: DataTypes.STRING},
    nom_filiere: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    }
  }, {
    tableName: 'Filiere',
    timestamps: false
  });

  Filiere.associate = (models) => {
    Filiere.hasMany(models.Etudiant, { 
      foreignKey: 'Id_F',
      as: 'Etudiant'
    });
    Filiere.hasMany(models.Enseigne, { 
      foreignKey: 'Id_F',
      as: 'Enseigne'
    });
  };

  return Filiere; 
};