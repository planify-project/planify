module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('service', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    serviceType: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    underscored: true,
    timestamps: true
  });

  Service.associate = (models) => {
    Service.belongsTo(models.User, {
      foreignKey: 'provider_id',
      as: 'user'
    });
  };

  return Service;
};