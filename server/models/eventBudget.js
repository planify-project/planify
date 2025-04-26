module.exports = (sequelize, DataTypes) => {
  const EventBudget = sequelize.define('EventBudget', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estimated: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    actual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    }
  }, {
    tableName: 'event_budgets',
    timestamps: false
  });

  return EventBudget;
};