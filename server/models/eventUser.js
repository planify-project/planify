module.exports = (sequelize, DataTypes) => {
  return sequelize.define('event_user', {
    event_id: { 
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    user_id: { 
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    role: DataTypes.ENUM('organizer', 'co-host')
  }, {
    underscored: true,
    timestamps: true
  });
};