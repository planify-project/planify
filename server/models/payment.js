module.exports = (sequelize, DataTypes) => {
  return sequelize.define('payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    event_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    method: DataTypes.ENUM('cash', 'transfer'),
    status: DataTypes.STRING
  }, {
    underscored: true,
    timestamps: true
  });
};