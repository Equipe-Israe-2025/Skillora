export default  (sequelize, DataTypes) => {
  const Groupe = sequelize.define('Groupe', {
      Id_G: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      nom_groupe: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              notEmpty: true
          }
      },
      Annee: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
              isInt: true,
              min: 2000,
              max: new Date().getFullYear() + 5
          }
      }
  }, {
      tableName: 'Groupe',
      timestamps: false,
      indexes: [
          {
              unique: true,
              fields: ['nom_groupe', 'Annee']
          }
      ]
  });

  Groupe.associate = (models) => {
      Groupe.hasMany(models.Forme, { 
          foreignKey: 'Id_G',
          as: 'groupe'
      });
  };

  return Groupe;
};