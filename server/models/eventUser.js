module.exports = (sequelize, DataTypes) => {
  return sequelize.define('event_user', {
    event_id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    role: DataTypes.ENUM('organizer', 'co-host')
  }, {
    underscored: true,
    timestamps: true
  });
};