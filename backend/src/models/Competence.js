export default  (sequelize, DataTypes) => {
  const Competence = sequelize.define('Competence', {
    Id_C: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'Competence',
    timestamps: false
  });

  Competence.associate = (models) => {
    Competence.hasMany(models.Indicateur, { 
      foreignKey: 'Id_C',
      as: 'indicateur'
    });
    Competence.hasMany(models.Baser, { 
      foreignKey: 'Id_C',
      as: 'baser'
    });
  };

  return Competence;
};