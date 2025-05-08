export default (sequelize, DataTypes) => {
  const Enseigne = sequelize.define('Enseigne', {
    Num_sum: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Encadrant',
        key: 'Num_sum'
      }
    },
    Id_F: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Filiere',
        key: 'Id_F'
      }
    }
  }, {
    tableName: 'Enseigne',
    timestamps: false
  });

  Enseigne.associate = (models) => {
    Enseigne.belongsTo(models.Encadrant, { 
      foreignKey: 'Num_sum',
      as: 'encadrant'
    });
    Enseigne.belongsTo(models.Filiere, { 
      foreignKey: 'Id_F',
      as: 'filiere'
    });
  };

  return Enseigne;
};