const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceCategory = (sequelize, DataTypes) => {
  const ServiceCategory = sequelize.define('ServiceCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'service_categories'
  });

  return ServiceCategory;
};

module.exports = ServiceCategory; 