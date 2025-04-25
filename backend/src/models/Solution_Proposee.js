export default  (sequelize, DataTypes) => {
    const Solution_Proposee = sequelize.define('Solution_Proposee', {
      Id_SP: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: DataTypes.TEXT,
      dateDebut: DataTypes.DATE,
      dateFin: DataTypes.DATE
    }, {
      tableName: 'Solution_Proposee',
      timestamps: false
    });
  
    Solution_Proposee.associate = (models) => {
      Solution_Proposee.hasMany(models.Proposer, { foreignKey: 'Id_SP' });
    };
  
    return Solution_Proposee;
  };
  