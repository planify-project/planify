module.exports = (sequelize, DataTypes) => {
  return sequelize.define('event_guest', {
    event_id: { 
      type: DataTypes.UUID, // Match the UUID type of the `id` column in the `events` table
      primaryKey: true 
    },
    user_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rsvp_status: {
      type: DataTypes.ENUM('invited', 'accepted', 'declined', 'maybe'),
      allowNull: true,
    },
  }, {
    underscored: true,
    timestamps: true,
  });
};