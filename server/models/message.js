module.exports = (sequelize, DataTypes) => {
  return sequelize.define('message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    from_user_id: DataTypes.INTEGER,
    to_user_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    event_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
};