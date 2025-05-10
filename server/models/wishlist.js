module.exports = (sequelize, DataTypes) => {
  return sequelize.define('wishlist', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true,
    },
    user_id: { 
      type: DataTypes.UUID, // Match the type of `users.id`
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    underscored: true,
    timestamps: true,
  });
};