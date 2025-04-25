const { DataTypes } = require('sequelize');

const MonthlyReport = (sequelize, DataTypes) => {
  const MonthlyReport = sequelize.define('MonthlyReport', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    month: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    total_events: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_revenue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    avg_rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    }
  }, {
    tableName: 'monthly_reports',
    indexes: [
      {
        unique: true,
        fields: ['month']
      }
    ]
  });

  return MonthlyReport;
};

module.exports = MonthlyReport; 