module.exports = (sequelize, DataTypes) => {
  return sequelize.define('service_media', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    service_id: DataTypes.INTEGER,
    type: DataTypes.ENUM('image', 'video'),
    url: DataTypes.STRING
  }, {
    underscored: true,
    timestamps: true
  });
};