export default (sequelize, DataTypes) => {
  const Forme = sequelize.define('Forme', {
      Num_sum: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
          references: {
              model: 'Encadrant',
              key: 'Num_sum'
          }
      },
      Id_G: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          references: {
              model: 'Groupe',
              key: 'Id_G'
          }
      },
      CNE: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
          references: {
              model: 'Etudiant',
              key: 'CNE'
          }
      }
  }, {
      tableName: 'Forme',
      timestamps: false
  });

  Forme.associate = (models) => {
      Forme.belongsTo(models.Encadrant, { 
          foreignKey: 'Num_sum',
          as: 'encadrant'
      });
      Forme.belongsTo(models.Groupe, { 
          foreignKey: 'Id_G',
          as: 'groupe'
      });
      Forme.belongsTo(models.Etudiant, { 
          foreignKey: 'CNE',
          as: 'etudiant'
      });
  };

  return Forme;
};