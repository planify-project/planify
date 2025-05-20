module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define('wishlist', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    user_id: { 
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: 'default'
    },
    name: { 
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'My Wishlist'
    }
  }, {
    tableName: 'wishlists',
    underscored: true,
    timestamps: true
  });

  Wishlist.associate = (models) => {
    Wishlist.belongsTo(models.User, { foreignKey: 'user_id', constraints: false });
    Wishlist.hasMany(models.WishlistItem, { foreignKey: 'wishlist_id' });
  };

  return Wishlist;
};