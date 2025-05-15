module.exports = (sequelize, DataTypes) => {
  return sequelize.define('wishlist', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.UUID,
    name: DataTypes.STRING
  }, {
    underscored: true,
    timestamps: true
  });
};