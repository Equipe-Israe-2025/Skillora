export default (sequelize, DataTypes) => {
  const Encadrant = sequelize.define('Encadrant', {
    Num_sum: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    specialite: { 
      type: DataTypes.STRING
    },
    Id_U: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Utilisateur',
        key: 'Id_U'
      }
    }
  }, {
    tableName: 'Encadrant',
    timestamps: false
  });

  Encadrant.associate = (models) => {
    Encadrant.belongsTo(models.Utilisateur, { 
      foreignKey: 'Id_U',
      as: 'utilisateur'
    });
    Encadrant.hasMany(models.Forme, { 
      foreignKey: 'Num_sum',
      as: 'forme'
    });
    Encadrant.hasMany(models.Enseigne, { 
      foreignKey: 'Num_sum',
      as: 'enseigne'
    });
  };

  return Encadrant;
};