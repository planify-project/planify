module.exports = (sequelize, DataTypes) => {
  return sequelize.define('service', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    provider_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL
  }, {
    underscored: true,
    timestamps: true
  });
};