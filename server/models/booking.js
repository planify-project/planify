module.exports = (sequelize, DataTypes) => {
  return sequelize.define('booking', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    event_id: DataTypes.INTEGER,
    status: DataTypes.ENUM('requested', 'confirmed', 'canceled', 'completed'),
    created_at: DataTypes.DATE
  }, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
};