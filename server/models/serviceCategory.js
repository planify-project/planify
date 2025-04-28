module.exports = (sequelize, DataTypes) => {
  return sequelize.define('service_category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING
  }, {
    underscored: true,
    timestamps: true
  });
};