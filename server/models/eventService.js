module.exports = (sequelize, DataTypes) => {
  return sequelize.define('event_service', {
    event_id: { type: DataTypes.INTEGER, primaryKey: true },
    service_id: { type: DataTypes.INTEGER, primaryKey: true },
    status: DataTypes.STRING
  }, {
    underscored: true,
    timestamps: true
  });
};