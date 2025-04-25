export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    Id_N: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 100]
      }
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lu: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    Id_U: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Utilisateur',
        key: 'Id_U'
      }
    },
    type: {  // Nouveau champ pour catégoriser les notifications
      type: DataTypes.ENUM(
        'evaluation', 
        'signalement', 
        'badge', 
        'groupe',
        'systeme'
      ),
      allowNull: false,
      defaultValue: 'systeme'
    },
    lien: {  // Nouveau champ pour stocker un lien d'action
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {  // Nouveau champ pour données supplémentaires
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    tableName: 'Notification',
    timestamps: false,
    indexes: [
      {
        fields: ['Id_U', 'lu']  // Index pour requêtes fréquentes
      }
    ]
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.Utilisateur, { 
      foreignKey: 'Id_U',
      as: 'destinataire'
    });
  };

  return Notification;
};