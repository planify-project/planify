module.exports = (sequelize, DataTypes) => {
  return sequelize.define('booking', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    user_id: { 
      type: DataTypes.STRING, // user_id is a string
    },
    service_id: { 
      type: DataTypes.INTEGER 
    },
    event_id: { 
      type: DataTypes.UUID, // <-- Change from UUID to STRING to match events.id
    },
    status: {
      type: DataTypes.ENUM('requested', 'confirmed', 'canceled', 'completed'),
    },
    created_at: {
      type: DataTypes.DATE,
    },
  }, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
};