// fct exporte automa... par node js prend 2 param (instance de ma conn au base de donne et l objet qui indique le type d attribut )
export default  (Sequelize,DataTypes)=>{
    // craetion du modele 
 const Utilisateur= Sequelize.define('Utilisateur',{
    Id_U:{
        type: DataTypes.INTEGER ,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true  // L'utilisateur peut ne pas avoir encore ajouté d'image
    },    
    prenom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Etudiant', 'Administrateur', 'Encadrant', 'Tuteur'),
        allowNull: false
      },
    taux: DataTypes.FLOAT
  },
  {
    tableName: 'Utilisateur',  //precise  le nom exact de la table dans PostgreSQL 
    timestamps: false  // pas creer les 2col createdAt et updateAt

 });
  //definir les relations Nb que Cette méthode sera appelée par Sequelize plus tard pour connecter ce modèle aux autres.
  Utilisateur.associate = (models) => {
    if (models.Notification) {
      Utilisateur.hasMany(models.Notification, { foreignKey: 'Id_U' });
    }
    if (models.Etudiant) {
      Utilisateur.hasOne(models.Etudiant, { foreignKey: 'Id_U' });
    }
    if (models.Encadrant) {
      Utilisateur.hasOne(models.Encadrant, { foreignKey: 'Id_U' });
    }
    if (models.Evaluation) {
      Utilisateur.hasMany(models.Evaluation, { foreignKey: 'Id_U' });
    }
    if (models.Baser) {
      Utilisateur.hasMany(models.Baser, { foreignKey: 'Id_U' });
    }
    if (models.Badge) {
      Utilisateur.hasMany(models.Badge, { foreignKey: 'Id_U' });
    }
    if (models.Signalement) {
      Utilisateur.hasMany(models.Signalement, { foreignKey: 'Id_U' });
    }
    if (models.Administrateur) {
      Utilisateur.hasOne(models.Administrateur, { foreignKey: 'Id_U' });
    }
    if (models.Tuteur) {
      Utilisateur.hasOne(models.Tuteur, { foreignKey: 'Id_U' });
    }
  };
  

  return Utilisateur;

};