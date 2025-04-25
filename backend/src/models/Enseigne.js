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
    Id_G: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Groupe',
        key: 'Id_G'
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
    Enseigne.belongsTo(models.Groupe, { 
      foreignKey: 'Id_G',
      as: 'groupe'
    });
  };

  return Enseigne;
};