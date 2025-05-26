const { Conversation, User, Message } = require("../database");
const { Op } = require("sequelize");
const { sequelize } = require("../database");

module.exports = {
    getAllConversations: async (req, res) => {
        try {
            const conversations = await Conversation.findAll({
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'email', 'profilePic']
                }]
            });
            res.status(200).json(conversations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getConversationsByUserId: async (req, res) => {
        try {
            const { userId } = req.params;
            console.log('Fetching conversations for user:', userId);
            
            // First get all conversations
            const allConversations = await Conversation.findAll();
            console.log('All conversations in database:', JSON.stringify(allConversations, null, 2));
            
            // Then filter in JavaScript
            const userConversations = allConversations.filter(conv => {
                try {
                    console.log('Checking conversation:', conv.id, 'Members:', conv.members);
                    const members = Array.isArray(conv.members) ? conv.members : JSON.parse(conv.members);
                    const includes = members.includes(userId);
                    console.log('Does conversation include user?', includes);
                    return includes;
                } catch (e) {
                    console.error('Error parsing members for conversation', conv.id, ':', e);
                    return false;
                }
            });
            
            console.log('Found conversations for user:', JSON.stringify(userConversations, null, 2));
            res.status(200).json(userConversations);
        } catch (error) {
            console.error('Error in getConversationsByUserId:', error);
            res.status(500).json({ message: error.message });
        }
    },

    createConversation: async (req, res) => {
        try {
            const { senderId, receiverId } = req.body;
            
            if (!senderId || !receiverId) {
                console.error('Missing required fields:', { senderId, receiverId });
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: senderId and receiverId'
                });
            }

            console.log('Creating conversation between:', senderId, 'and', receiverId);

            // Check if users exist
            const [sender, receiver] = await Promise.all([
                User.findByPk(senderId),
                User.findByPk(receiverId)
            ]);

            if (!sender || !receiver) {
                console.error('Users not found:', { sender, receiver });
                return res.status(404).json({
                    success: false,
                    message: 'One or both users not found'
                });
            }

            // Get all conversations and filter in JavaScript
            const allConversations = await Conversation.findAll();
            const existingConversation = allConversations.find(conv => {
                try {
                    const members = Array.isArray(conv.members) ? conv.members : JSON.parse(conv.members);
                    return members.includes(senderId) && members.includes(receiverId);
                } catch (e) {
                    console.error('Error parsing members for conversation', conv.id, ':', e);
                    return false;
                }
            });
            
            if (existingConversation) {
                console.log('Found existing conversation:', existingConversation.id);
                return res.status(200).json({
                    success: true,
                    data: existingConversation
                });
            }
            
            // Create new conversation with members as an array
            const newConversation = await Conversation.create({
                members: [senderId, receiverId],
                lastMessage: null,
                lastMessageTime: null
            });

            if (!newConversation) {
                throw new Error('Failed to create conversation');
            }

            console.log('Created new conversation:', newConversation.id);
            
            // Fetch the created conversation with all fields
            const createdConversation = await Conversation.findByPk(newConversation.id, {
                include: [{
                    model: User,
                    as: 'participants',
                    attributes: ['id', 'name', 'email', 'profilePic']
                }]
            });
            
            return res.status(201).json({
                success: true,
                data: createdConversation
            });
        } catch (error) {
            console.error('Create conversation error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create conversation',
                error: error.message
            });
        }
    },

    getConversation: async (req, res) => {
        try {
            const conversation = await Conversation.findByPk(req.params.id, {
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'email', 'profilePic']
                }]
            });
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }
            res.status(200).json(conversation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteConversation: async (req, res) => {
        try {
            const conversation = await Conversation.destroy({
                where: { id: req.params.id }
            });
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }
            res.status(200).json({ message: 'Conversation deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateConversation: async (req, res) => {
        try {
            const conversation = await Conversation.update(req.body, {
                where: { id: req.params.id },
                returning: true
            });
            if (!conversation[0]) {
                return res.status(404).json({ message: 'Conversation not found' });
            }
            res.status(200).json(conversation[1][0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getConversationByUserIds: async (req, res) => {
        try {
            const { userId, otherUserId } = req.params;
            const conversation = await Conversation.findOne({
                where: {
                    members: {
                        [Op.or]: [
                            sequelize.literal(`JSON_CONTAINS(members, '["${userId}", "${otherUserId}"]')`),
                            sequelize.literal(`JSON_CONTAINS(members, '["${otherUserId}", "${userId}"]')`)
                        ]
                    }
                },
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'email', 'profilePic']
                }]
            });
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }
            res.status(200).json(conversation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getMessagesByUserIds: async (req, res) => {
        try {
            const { userId, otherUserId } = req.params;
            const conversation = await Conversation.findOne({
                where: {
                    members: {
                        [Op.or]: [
                            sequelize.literal(`JSON_CONTAINS(members, '["${userId}", "${otherUserId}"]')`),
                            sequelize.literal(`JSON_CONTAINS(members, '["${otherUserId}", "${userId}"]')`)
                        ]
                    }
                }
            });
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }
            const messages = await Message.findAll({
                where: { roomId: conversation.id },
                include: [{
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'name', 'email', 'profilePic']
                }],
                order: [['createdAt', 'ASC']]
            });
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getConversationById: async (req, res) => {
        try {
            const conversation = await Conversation.findByPk(req.params.id, {
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'email', 'profilePic']
                }]
            });
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }
            res.status(200).json(conversation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
