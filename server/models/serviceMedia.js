const { DataTypes } = require('sequelize');

const ServiceMedia = (sequelize, DataTypes) => {
  const ServiceMedia = sequelize.define('ServiceMedia', {
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
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: false
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'service_media'
  });

  return ServiceMedia;
};

module.exports = ServiceMedia; 