const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.ENUM('admin', 'user', 'provider'),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'roles'
  });

  return Role;
};

module.exports = Role; 