module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'ID of the user who should receive this notification'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Notification title'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Notification message content'
    },
    type: {
      type: DataTypes.ENUM(
        'booking_request',
        'booking_response',
        'booking_cancelled',
        'chat_message',
        'service_update',
        'system'
      ),
      allowNull: false,
      comment: 'Type of notification'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Whether the notification has been read'
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID of the related item (booking, service, etc.)'
    },
    itemType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Type of the related item'
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional notification metadata'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
      allowNull: false,
      comment: 'Notification priority level'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the notification should expire'
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['type']
      },
      {
        fields: ['isRead']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Notification.belongsTo(models.Booking, {
      foreignKey: 'itemId',
      constraints: false,
      scope: {
        itemType: 'booking'
      }
    });
    Notification.belongsTo(models.Service, {
      foreignKey: 'itemId',
      constraints: false,
      scope: {
        itemType: 'service'
      }
    });
  };

  // Instance methods
  Notification.prototype.markAsRead = async function() {
    this.isRead = true;
    await this.save();
    return this;
  };

  Notification.prototype.markAsUnread = async function() {
    this.isRead = false;
    await this.save();
    return this;
  };

  // Class methods
  Notification.findUnreadByUser = async function(userId) {
    return this.findAll({
      where: {
        userId,
        isRead: false
      },
      order: [['createdAt', 'DESC']]
    });
  };

  Notification.findByUser = async function(userId, options = {}) {
    const { limit = 20, offset = 0, includeRead = true } = options;
    return this.findAndCountAll({
      where: {
        userId,
        ...(includeRead ? {} : { isRead: false })
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
  };

  return Notification;
};
