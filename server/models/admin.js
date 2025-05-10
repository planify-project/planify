module.exports = (sequelize, DataTypes) => {
  return sequelize.define('admin', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { 
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    super_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    permissions: DataTypes.JSON
  }, {
    underscored: true,
    timestamps: true
  });
};