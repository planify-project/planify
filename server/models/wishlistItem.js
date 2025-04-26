module.exports = (sequelize, DataTypes) => {
  const WishlistItem = sequelize.define('WishlistItem', {
    wishlist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'wishlists',
        key: 'id'
      }
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    item_type: {
      type: DataTypes.ENUM('event', 'service', 'equipment', 'eventSpace'),
      allowNull: false
    }
  }, {
    tableName: 'wishlist_items',
    timestamps: false
  });

  return WishlistItem;
};