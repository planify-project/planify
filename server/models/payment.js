module.exports = (sequelize, DataTypes) => {
  return sequelize.define('payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.INTEGER, // Changed from UUID to INTEGER to match events table
      allowNull: true,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'services', // Changed from Services to services (lowercase)
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM('cash', 'transfer'),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'payments',
    underscored: true,
    timestamps: true
  });
};