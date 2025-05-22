// controllers/messageController.js

const { Message, Conversation, User, Notification } = require('../database');
const { Op } = require('sequelize');
const { getIO } = require('../socket');

// Create a new message
exports.createMessage = async (req, res) => {
    try {
        const { text, roomId, senderId, receiverId } = req.body;
        console.log('Creating message with data:', { text, roomId, senderId, receiverId });

        if (!text || !roomId || !senderId || !receiverId) {
            console.error('Missing required fields:', { text, roomId, senderId, receiverId });
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Verify conversation exists
        const conversation = await Conversation.findByPk(roomId);
        if (!conversation) {
            console.error('Conversation not found:', roomId);
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        // Verify users are part of the conversation
        const members = Array.isArray(conversation.members) ? conversation.members : JSON.parse(conversation.members);
        if (!members.includes(senderId) || !members.includes(receiverId)) {
            console.error('Users not part of conversation:', { senderId, receiverId, members });
            return res.status(403).json({
                success: false,
                message: 'Users are not part of this conversation'
            });
        }

        // Create the message
        const message = await Message.create({
            text,
            roomId,
            senderId,
            receiverId,
            status: 'sent',
            timestamp: new Date()
        });

        console.log('Message created:', message.id);

        // Update conversation with last message
        await conversation.update({
            lastMessage: text,
            lastMessageTime: new Date()
        });

        // Get sender's name for notification
        const sender = await User.findByPk(senderId);
        const senderName = sender ? sender.name : 'Someone';

        // Create notification for the receiver
        await Notification.create({
            userId: receiverId,
            title: 'New Message',
            message: `New message from ${senderName}: ${text}`,
            type: 'chat_message',
            relatedId: message.id,
            isRead: false,
            priority: 'medium'
        });

        // Get the message with sender details
        const messageWithSender = await Message.findByPk(message.id, {
            include: [{
                model: User,
                as: 'sender',
                attributes: ['id', 'name', 'image']
            }]
        });

        if (!messageWithSender) {
            throw new Error('Failed to fetch message with sender details');
        }

        // Emit the message to the conversation room
        try {
            const io = getIO();
            if (io) {
                io.to(roomId.toString()).emit('receive_message', {
                    ...messageWithSender.dataValues,
                    timestamp: new Date().toISOString(),
                });
                console.log('Message emitted to room:', roomId);
            } else {
                console.warn('Socket.io instance not available');
            }
        } catch (socketError) {
            console.error('Error emitting message:', socketError);
            // Continue with the response even if socket emission fails
        }

        res.status(201).json({
            success: true,
            data: messageWithSender
        });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating message',
            error: error.message 
        });
    }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({
            include: [{
                model: User,
                as: 'sender',
                attributes: ['id', 'name', 'image']
            }],
            order: [['createdAt', 'ASC']]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Something went wrong while fetching messages.' });
    }
};

// Get messages by room ID
exports.getMessagesByRoomId = async (req, res) => {
    try {
        const { roomId } = req.params;
        console.log('Fetching messages for room:', roomId);

        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: 'Room ID is required'
            });
        }

        // First verify the conversation exists
        const conversation = await Conversation.findByPk(roomId);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        // Then fetch messages
        const messages = await Message.findAll({
            where: { roomId },
            include: [{
                model: User,
                as: 'sender',
                attributes: ['id', 'name', 'image'],
                required: false
            }],
            order: [['createdAt', 'ASC']]
        });

        console.log(`Found ${messages.length} messages for room ${roomId}`);

        // Transform messages to include sender data in a more accessible format
        const transformedMessages = messages.map(message => ({
            ...message.toJSON(),
            sender: message.sender ? {
                id: message.sender.id,
                name: message.sender.name,
                image: message.sender.image
            } : null
        }));

        res.json({
            success: true,
            data: transformedMessages
        });
    } catch (error) {
        console.error('Error fetching messages by room:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching messages',
            error: error.message 
        });
    }
};

// Get a single message by ID
exports.getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findByPk(id, {
            include: [{
                model: User,
                as: 'sender',
                attributes: ['id', 'name', 'image']
            }]
        });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.status(200).json(message);
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ error: 'Something went wrong while fetching the message.' });
    }
};

// Update a message by ID
exports.updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, isRead } = req.body;

        const message = await Message.findByPk(id);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        await message.update({ 
            text, 
            isRead 
        });

        res.status(200).json(message);
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ error: 'Something went wrong while updating the message.' });
    }
};

// Delete a message by ID
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findByPk(id);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        await message.destroy();
        res.status(200).json({ message: 'Message deleted successfully.' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Something went wrong while deleting the message.' });
    }
};

exports.markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findByPk(messageId);
        
        if (!message) {
            return res.status(404).json({ 
                success: false, 
                message: 'Message not found' 
            });
        }

        message.isRead = true;
        await message.save();

        res.json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error marking message as read',
            error: error.message 
        });
    }
};

// Update message status
exports.updateMessageStatus = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { status } = req.body;

        if (!['sent', 'received', 'read'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const message = await Message.findByPk(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        await message.update({ status });
        
        // Try to emit status update through socket, but don't fail if it doesn't work
        try {
            const io = getIO();
            if (io) {
                io.to(message.roomId.toString()).emit('message_status_update', {
                    messageId: message.id,
                    status: message.status
                });
            }
        } catch (socketError) {
            console.warn('Failed to emit message status update:', socketError);
            // Continue with the response even if socket emission fails
        }

        res.json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Error updating message status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating message status',
            error: error.message
        });
    }
}; 