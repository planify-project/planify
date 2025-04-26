module.exports = (sequelize, DataTypes) => {
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
    type: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'service_media'
  });

  return ServiceMedia;
};