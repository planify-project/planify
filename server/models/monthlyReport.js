module.exports = (sequelize, DataTypes) => {
  return sequelize.define('monthly_report', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    total_events: DataTypes.INTEGER,
    revenue: DataTypes.DECIMAL,
    avg_rating: DataTypes.DECIMAL
  }, {
    underscored: true,
    timestamps: true
  });
};