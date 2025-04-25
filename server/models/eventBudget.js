const { DataTypes } = require('sequelize');

const EventBudget = (sequelize, DataTypes) => {
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
      },
      unique: 'event_category_unique'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'event_category_unique'
    },
    allocated_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    actual_spent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'event_budgets'
  });

  return EventBudget;
};

module.exports = EventBudget; 