module.exports = (sequelize, DataTypes) => {
  return sequelize.define('message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    from_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.UUID, // Match the UUID type of the `id` column in the `events` table
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW,
    },
  }, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
};