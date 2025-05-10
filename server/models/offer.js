module.exports = (sequelize, DataTypes) => {
  return sequelize.define('offer', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    provider_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    description: DataTypes.TEXT,
    discount_percent: DataTypes.DECIMAL,
    expires_at: DataTypes.DATE
  }, {
    underscored: true,
    timestamps: true
  });
};