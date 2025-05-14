module.exports = (sequelize, DataTypes) => {
  return sequelize.define('review', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true,
    },
    reviewer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.INTEGER, // Changed from UUID to INTEGER to match events table
      allowNull: true,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'services', // Changed from Services to services
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    tableName: 'reviews',
    underscored: true,
    timestamps: true,
  });
};
