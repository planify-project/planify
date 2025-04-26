module.exports = (sequelize, DataTypes) => {
  const EventService = sequelize.define('EventService', {
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('booked', 'pending', 'canceled'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'event_services',
    timestamps: false
  });

  return EventService;
};