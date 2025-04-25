export default  (sequelize, DataTypes) => {
  const Administrateur = sequelize.define('Administrateur', {
    Id_A: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Id_U: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Utilisateur',
        key: 'Id_U'
      }
    }
  }, {
    tableName: 'Administrateur',
    timestamps: false
  });

  Administrateur.associate = (models) => {
    Administrateur.belongsTo(models.Utilisateur, { 
      foreignKey: 'Id_U',
      as: 'utilisateur'
    });
  };

  return Administrateur;
};