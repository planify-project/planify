module.exports = (sequelize, DataTypes) => {
  return sequelize.define('message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    from_user_id: {
      type: DataTypes.UUID, // Match the type of `users.id`
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    to_user_id: {
      type: DataTypes.UUID, // Match the type of `users.id`
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.UUID, // Match the type of `events.id`
      allowNull: true,
      references: {
        model: 'events',
        key: 'id',
      },
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