module.exports = (sequelize, DataTypes) => {
  return sequelize.define('notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.TEXT,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    type: {
      type: DataTypes.STRING, // e.g., 'booking', 'message', etc.
    },
  }, {
    underscored: true,
    timestamps: true,
  });
};
