export default (sequelize, DataTypes) => {
  const Tuteur = sequelize.define('Tuteur', {
    Id_U: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Utilisateur',
        key: 'Id_U'
      }
    },
    specialite: DataTypes.STRING
  }, {
    tableName: 'Tuteur',
    timestamps: false
  });

  Tuteur.associate = function(models) {
    Tuteur.belongsTo(models.Utilisateur, { foreignKey: 'Id_U' });
  };

  return Tuteur;
};