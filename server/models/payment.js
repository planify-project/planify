const { DataTypes } = require('sequelize');

const Payment = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    method: {
      type: DataTypes.ENUM('cash', 'transfer'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('paid', 'pending'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'payments'
  });

  return Payment;
};

module.exports = Payment; 