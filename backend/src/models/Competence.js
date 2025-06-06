export default  (sequelize, DataTypes) => {
  const Competence = sequelize.define('Competence', {
    Id_C: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
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