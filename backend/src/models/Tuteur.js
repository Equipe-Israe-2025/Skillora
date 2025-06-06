export default (sequelize, DataTypes) => {
  const Tuteur = sequelize.define("Tuteur", {
    Id_U: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Utilisateur",
        key: "Id_U"
      }
    }
  });

  Tuteur.associate = (models) => {
    Tuteur.hasMany(models.Etudiant, {
      foreignKey: "CNE",
      as: "etudiant"
    });
  };

  return Tuteur;
};