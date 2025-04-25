export default (sequelize, DataTypes) => {
  const Proposer = sequelize.define('Proposer', {
      Id_S: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: {
              model: 'Signalement',
              key: 'Id_S'
          }
      },
      Id_SP: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: {
              model: 'Solution_Proposee',
              key: 'Id_SP'
          }
      }
  }, {
      tableName: 'Proposer',
      timestamps: false
  });

  Proposer.associate = (models) => {
      Proposer.belongsTo(models.Signalement, { 
          foreignKey: 'Id_S',
          as: 'signalement'
      });
      Proposer.belongsTo(models.Solution_Proposee, { 
          foreignKey: 'Id_SP',
          as: 'solution'
      });
  };

  return Proposer;
};
  