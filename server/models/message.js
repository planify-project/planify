module.exports = (sequelize, DataTypes) => {
  return sequelize.define('message', {
    roomId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }
  );
};
