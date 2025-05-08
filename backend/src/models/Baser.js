export default  (sequelize, DataTypes) => {
  const Baser = sequelize.define('Baser', {
    Id_I: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Indicateur',
        key: 'Id_I'
      }
    },
    Id_C: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: 'Competence',
        key: 'Id_C'
      }
    },
    Id_eval: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Evaluation',
        key: 'Id_eval'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {
    tableName: 'Baser',
    timestamps: true
  });

  Baser.associate = (models) => {
    Baser.belongsTo(models.Evaluation, { 
      foreignKey: 'Id_eval',
      as: 'Evaluation'
    });
    Baser.belongsTo(models.Competence, { 
      foreignKey: 'Id_C',
      as: 'competence'
    });
    Baser.belongsTo(models.Indicateur, { 
      foreignKey: 'Id_I',
      as: 'indicateur'
    });
  };

  return Baser;
};