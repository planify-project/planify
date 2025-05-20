const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, {
        foreignKey: 'from_user_id',
        as: 'sender'
      });
      Message.belongsTo(models.Service, {
        foreignKey: 'service_id'
      });
    }
  }

  Message.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    from_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    to_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
     service_id: {   
      type: DataTypes.INTEGER, 
      allowNull: false, 
       references: {
        model: 'services',  
        key: 'id'
      }
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false 
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        fields: ['service_id', 'from_user_id', 'to_user_id']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  return Message;
};