module.exports = (sequelize, DataTypes) => {
  return sequelize.define('event_guest', {
    event_id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    rsvp_status: DataTypes.ENUM('invited', 'accepted', 'declined', 'maybe')
  }, {
    underscored: true,
    timestamps: true
  });
};