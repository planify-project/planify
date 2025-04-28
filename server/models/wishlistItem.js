module.exports = (sequelize, DataTypes) => {
  return sequelize.define('wishlist_item', {
    wishlist_id: { type: DataTypes.INTEGER, primaryKey: true },
    item_id: DataTypes.INTEGER,
    item_type: DataTypes.ENUM('event', 'service', 'equipment', 'eventSpace')
  }, {
    underscored: true,
    timestamps: true
  });
};