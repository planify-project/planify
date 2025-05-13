const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: { 
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_id: { 
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'services',
        key: 'id'
      }
    providerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    event_id: { 
      type: DataTypes.INTEGER, // Changed from UUID to INTEGER
      allowNull: true,
      references: {
        model: 'events',
        key: 'id'
      }
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('requested', 'confirmed', 'canceled', 'completed'),
      allowNull: false,
    },
    created_at: {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    space: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending'
    }
  });

  return Booking;
};
