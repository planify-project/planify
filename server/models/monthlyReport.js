module.exports = (sequelize, DataTypes) => {
  const MonthlyReport = sequelize.define('MonthlyReport', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_events: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    revenue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    avg_rating: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    tableName: 'monthly_reports',
    timestamps: false
  });

  return MonthlyReport;
};