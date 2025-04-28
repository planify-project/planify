module.exports = (sequelize, DataTypes) => {
  return sequelize.define('audit_log', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    admin_id: DataTypes.INTEGER,
    action_type: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    underscored: true,
    timestamps: true
  });
};