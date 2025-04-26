module.exports = (sequelize, DataTypes) => {
  const ServiceCategory = sequelize.define('ServiceCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'service_categories'
  });

  return ServiceCategory;
};