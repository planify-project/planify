module.exports = (sequelize, DataTypes) => {
  return sequelize.define('service', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    serviceType: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    agentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'agents',
        key: 'id'
      }
    }
  }, {
    underscored: true,
    timestamps: true
  });
};