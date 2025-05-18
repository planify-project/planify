module.exports = (sequelize, DataTypes) => {
  return sequelize.define('event_service', {
    event_id: { 
      type: DataTypes.INTEGER, // Changed from UUID to INTEGER
      primaryKey: true,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    service_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    status: DataTypes.STRING
  }, {
    underscored: true,
    timestamps: true
  });
};