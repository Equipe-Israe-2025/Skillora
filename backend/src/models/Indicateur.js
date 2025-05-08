export default (sequelize, DataTypes) => {
  const Indicateur = sequelize.define('Indicateur', {
      Id_I: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      libelle: {
          type: DataTypes.STRING,
          allowNull: false
      },
      description: {
          type: DataTypes.TEXT,
          allowNull: false
      },
      Id_C: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
              model: 'Competence',
              key: 'Id_C'
          }
      }
  }, {
      tableName: 'Indicateur',
      timestamps: false
  });

  Indicateur.associate = (models) => {
      Indicateur.belongsTo(models.Competence, { 
          foreignKey: 'Id_C',
          as: 'competence'
      });
      Indicateur.hasMany(models.Baser, { 
          foreignKey: 'Id_I',
          as: 'baser'
      });
  };

  return Indicateur;
};
  