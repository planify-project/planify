const { DataTypes } = require('sequelize');

const EventGuest = (sequelize, DataTypes) => {
  const EventGuest = sequelize.define('EventGuest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    rsvp_status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'declined'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'event_guests'
  });

  return EventGuest;
};

module.exports = EventGuest;