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
    Id_U: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Utilisateur',
        key: 'Id_U'
      }
    },
    CNE: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: 'Etudiant',
        key: 'CNE'
      }
    }
  }, {
    tableName: 'Baser',
    timestamps: false
  });

  Baser.associate = (models) => {
    Baser.belongsTo(models.Utilisateur, { 
      foreignKey: 'Id_U',
      as: 'utilisateur'
    });
    Baser.belongsTo(models.Competence, { 
      foreignKey: 'Id_C',
      as: 'competence'
    });
    Baser.belongsTo(models.Indicateur, { 
      foreignKey: 'Id_I',
      as: 'indicateur'
    });
    Baser.belongsTo(models.Etudiant, { 
      foreignKey: 'CNE',
      as: 'etudiant'
    });
  };

  return Baser;
};