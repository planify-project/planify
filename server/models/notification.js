module.exports = (sequelize, DataTypes) => {
  return sequelize.define('notification', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM('booking_request', 'booking_response', 'test'),
      allowNull: false
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'notifications',
    timestamps: true,
    underscored: true
  });
};
