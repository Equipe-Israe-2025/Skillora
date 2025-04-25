export default  (sequelize, DataTypes) => {
  const Etudiant = sequelize.define('Etudiant', {
    CNE: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        notEmpty: true,
        len: [6, 20]
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
    Id_F: {
      type: DataTypes.STRING,  // Correction: type cohérent avec Filiere.Id_F
      allowNull: false,
      references: {
        model: 'Filiere',
        key: 'Id_F'
      }
    }
  }, {
    tableName: 'Etudiant',
    timestamps: false
  });

  Etudiant.associate = (models) => {
    Etudiant.belongsTo(models.Utilisateur, { 
      foreignKey: 'Id_U',
      as: 'utilisateur'
    });
    Etudiant.belongsTo(models.Filiere, { 
      foreignKey: 'Id_F',
      as: 'filiere'
    });

    Etudiant.hasMany(models.Forme, { 
      foreignKey: 'CNE',
      as: 'groupe'
    });
    Etudiant.hasMany(models.Badge, { 
      foreignKey: 'CNE',
      as: 'badge'
    });
    Etudiant.hasMany(models.Evaluation, { 
      foreignKey: 'CNE',
      as: 'evaluation'
    });
    Etudiant.hasMany(models.Baser, { 
      foreignKey: 'CNE',
      as: 'baser'
    });
    Etudiant.hasMany(models.Signalement, { 
      foreignKey: 'CNE',
      as: 'signalement'
    });
  };

  return Etudiant;
};
  //belongsTo (Appartient à) Relation "un-à-un" ou "plusieurs-à-un" /La clé étrangère est placée dans la table source
  //hasMany (A plusieurs) Relation "un-à-plusieurs" La clé étrangère est dans la table cible