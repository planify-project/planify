module.exports = (sequelize, DataTypes) => {
  const WishlistItem = sequelize.define('wishlist_item', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
    underscored: true,
    timestamps: true
  });

  WishlistItem.associate = (models) => {
    WishlistItem.belongsTo(models.Wishlist, { foreignKey: 'wishlist_id' });
  };

  return WishlistItem;
};