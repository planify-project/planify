module.exports = (sequelize, DataTypes) => {
  return sequelize.define('booking', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true,
    },
    user_id: { 
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    service_id: { 
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    event_id: { 
      type: DataTypes.INTEGER, // Changed from UUID to INTEGER
      allowNull: true,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('requested', 'confirmed', 'canceled', 'completed'),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    underscored: true,
    timestamps: true
  });
};