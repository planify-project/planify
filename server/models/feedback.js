module.exports = (sequelize, DataTypes) => {
  return sequelize.define('feedback', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    message: DataTypes.TEXT
  }, {
    underscored: true,
    timestamps: true
  });
};