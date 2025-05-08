module.exports = (sequelize, DataTypes) => {
  return sequelize.define('offer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    provider_id: DataTypes.STRING, // Change to STRING to match the User model's id
    description: DataTypes.TEXT,
    discount_percent: DataTypes.DECIMAL,
    expires_at: DataTypes.DATE
  }, {
    underscored: true,
    timestamps: true
  });
};