const { DataTypes } = require('sequelize');

const EventUser = (sequelize, DataTypes) => {
  const EventUser = sequelize.define('EventUser', {
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
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('host', 'co-host'),
      allowNull: false
    }
  }, {
    tableName: 'event_users',
    indexes: [
      {
        unique: true,
        fields: ['event_id', 'user_id']
      }
    ]
  });

  return EventUser;
};

module.exports = EventUser; 