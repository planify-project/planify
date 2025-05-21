const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const User = require('../models/user');
const Service = require('../models/service');
const { Op } = require('sequelize');

// Send a new message
router.post('/', async (req, res) => {
  try {
    const { serviceId, fromUserId, toUserId, content } = req.body;

    // Validate required fields
    if (!serviceId || !fromUserId || !toUserId || !content) {
      console.error('Missing required fields:', { serviceId, fromUserId, toUserId, content });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Creating message with data:', {
      serviceId,
      fromUserId,
      toUserId,
      content
    });

    const message = await Message.create({
      service_id: serviceId,
      from_user_id: fromUserId,
      to_user_id: toUserId,
      content,
      is_read: false
    });

    console.log('Message created:', message.id);

    // Get the created message with sender info
    const messageWithSender = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'profile_picture']
        }
      ]
    });

    if (!messageWithSender) {
      console.error('Message created but not found with sender info');
      return res.status(500).json({ error: 'Failed to retrieve created message' });
    }

    console.log('Message retrieved with sender info:', messageWithSender.id);
    res.json(messageWithSender);
  } catch (error) {
    console.error('Error sending message:', error);
    // Send more detailed error information
    res.status(500).json({ 
      error: 'Failed to send message',
      details: error.message,
      code: error.name
    });
  }
});

// Get chat history for a specific service
router.get('/:serviceId/:userId/:providerId', async (req, res) => {
  try {
    const { serviceId, userId, providerId } = req.params;

    const messages = await Message.findAll({
      where: {
        service_id: serviceId,
        [Op.or]: [
          { from_user_id: userId, to_user_id: providerId },
          { from_user_id: providerId, to_user_id: userId }
        ]
      },
      order: [['created_at', 'ASC']],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'profile_picture']
        }
      ]
    });

    // Return empty array if no messages found
    res.json(messages || []);
  } catch (error) {
    console.error('Error fetching messages:', error);
    // Return empty array instead of error for no messages
    res.json([]);
  }
});

// Mark messages as read
router.put('/read/:serviceId/:userId/:providerId', async (req, res) => {
  try {
    const { serviceId, userId, providerId } = req.params;

    await Message.update(
      { is_read: true },
      {
        where: {
          service_id: serviceId,
          from_user_id: providerId,
          to_user_id: userId,
          is_read: false
        }
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Get unread message count
router.get('/unread/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const unreadCount = await Message.count({
      where: {
        to_user_id: userId,
        is_read: false
      }
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

module.exports = router; 