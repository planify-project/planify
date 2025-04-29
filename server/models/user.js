module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    contact_details: DataTypes.JSON
  }, {
    underscored: true,
    timestamps: true
  });
};