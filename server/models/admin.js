module.exports = (sequelize, DataTypes) => {
  return sequelize.define('admin', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    super_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    permissions: DataTypes.JSON
  }, {
    underscored: true,
    timestamps: true
  });
};