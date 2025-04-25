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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
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