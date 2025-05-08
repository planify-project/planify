module.exports = (sequelize, DataTypes) => {
  return sequelize.define('payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.CHAR(36), // Force CHAR(36) to match events.id
      allowNull: true,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM('cash', 'transfer'),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.NOW,
    },
  }, {
    underscored: true,
    timestamps: true,
  });
};