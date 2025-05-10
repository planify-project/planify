const { CHAR } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const eventGuest = sequelize.define('event_guest', {
    event_id: { 
      type: DataTypes.UUID, // Match events.id type (STRING or UUID, but both must match)
      primaryKey: true,
      allowNull: false,
    },
    user_id: { 
      type: DataTypes.UUID, 
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rsvp_status: {
      type: DataTypes.ENUM('invited', 'accepted', 'declined', 'maybe'),
      allowNull: true,
    },
  }, {
    underscored: true,
    timestamps: true,
  });

  return eventGuest;
};