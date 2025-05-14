module.exports = (sequelize, DataTypes) => {
  return sequelize.define('notification', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    type: DataTypes.STRING
  }, {
    underscored: true,
    timestamps: true,
    tableName: 'notifications'
  });
};
