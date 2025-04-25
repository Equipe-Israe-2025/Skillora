export default  (sequelize, DataTypes) => {
    const Badge = sequelize.define('Badge', {
      Id_B: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nom_B: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      /*image: DataTypes.Blob,     // asln khasha tkoun f etud     //makanstokiwsh image f base de donnee
      visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },*/
      Id_C: {
        type: DataTypes.STRING,
        references: {
          model: 'Competence',
          key: 'Id_C'
        }
      },
      Id_U: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Utilisateur',
          key: 'Id_U'
        }
      },
      CNE: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Etudiant',
          key: 'CNE'
        }
      }
    }, {
      tableName: 'Badge',
      timestamps: false
    });
  
    Badge.associate = (models) => {
      Badge.belongsTo(models.Competence, { 
        foreignKey: 'Id_C',
        as: 'competence'
      });
      Badge.belongsTo(models.Utilisateur, { 
        foreignKey: 'Id_U',
        as: 'createur'
      });
      Badge.belongsTo(models.Etudiant, { 
        foreignKey: 'CNE',
        as: 'etudiant'
      });
    };
    return Badge;
  };
  