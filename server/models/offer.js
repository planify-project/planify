const { DataTypes } = require('sequelize');

const Offer = (sequelize, DataTypes) => {
  const Offer = sequelize.define('Offer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    discount_percent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100
      }
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'offers'
  });

  return Offer;
};

module.exports = Offer; 