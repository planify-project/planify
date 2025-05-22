module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
   
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    image: DataTypes.STRING,
    phone: DataTypes.STRING,
    contact_details: DataTypes.JSON,
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for Firebase users
    }, 
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },isProvider: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
   }, {
    underscored: true,
    timestamps: true, 
  });
};
