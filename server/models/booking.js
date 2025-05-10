module.exports = (sequelize, DataTypes) => {
  return sequelize.define('booking', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true,
    },
    user_id: { 
      type: DataTypes.UUID, // Match the type of `users.id`
      allowNull: false,
    },
    service_id: { 
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    event_id: { 
      type: DataTypes.UUID, // Match the type of `events.id`
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('requested', 'confirmed', 'canceled', 'completed'),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
};