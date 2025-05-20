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
    phone: DataTypes.STRING,
    contact_details: DataTypes.JSON,
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for Firebase users
    },
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
  });
};
