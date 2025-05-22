module.exports = (sequelize, DataTypes) => {
    const conversation = sequelize.define('conversation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        members: {
            type: DataTypes.JSON,
            allowNull: false
        },
        lastMessage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastMessageTime: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });
  
    return conversation;
};