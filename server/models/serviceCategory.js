module.exports = (sequelize, DataTypes) => {
  return sequelize.define('service_category', {
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
    tableName: 'service_categories',
    underscored: true,
    timestamps: true
  });
};