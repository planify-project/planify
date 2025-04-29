module.exports = (sequelize, DataTypes) => {
  return sequelize.define('service_availability', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    service_id: DataTypes.INTEGER,
    day_of_week: DataTypes.INTEGER,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME
  }, {
    underscored: true,
    timestamps: true
  });
};