const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Conversation = sequelize.define('Conversation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        members: {
            type: DataTypes.JSON,
            allowNull: false,
            get() {
                const rawValue = this.getDataValue('members');
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            },
            set(value) {
                this.setDataValue('members', Array.isArray(value) ? value : JSON.parse(value));
            },
            validate: {
                isValidMembers(value) {
                    const members = typeof value === 'string' ? JSON.parse(value) : value;
                    if (!Array.isArray(members) || members.length !== 2) {
                        throw new Error('Members must be an array of exactly 2 user IDs');
                    }
                    if (!members.every(id => typeof id === 'string' || typeof id === 'number')) {
                        throw new Error('All member IDs must be strings or numbers');
                    }
                }
            }
        },
        lastMessage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastMessageTime: {
            type: DataTypes.DATE,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true,
        indexes: [
            {
                name: 'idx_members',
                fields: [sequelize.literal('(CAST(members AS CHAR(100)))')]
            }
        ]
    });

    return Conversation;
};