const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Verification = (sequelize, DataTypes) => {
  const Verification = sequelize.define('Verification', {
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
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('email', 'phone'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'verified'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'verifications'
  });

  return Verification;
};

module.exports = Verification; 