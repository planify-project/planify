module.exports = (sequelize, DataTypes) => {
  return sequelize.define('message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    from_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    to_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    event_id: {
      type: DataTypes.INTEGER, // Changed from UUID to INTEGER
      allowNull: true,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    content: DataTypes.TEXT
  }, {
    underscored: true,
    timestamps: true
  });
};