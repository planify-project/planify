module.exports = (sequelize, DataTypes) => {
  return sequelize.define('notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    is_read: DataTypes.BOOLEAN,
    type: DataTypes.STRING
  }, {
    underscored: true,
    timestamps: true
  });
};