// routes/message.router.js

const express = require('express');
const router = express.Router();
const { 
    createMessage, 
    deleteMessage, 
    getAllMessages, 
    getMessageById, 
    getMessagesByRoomId,
    updateMessage,
    markMessageAsRead,
    updateMessageStatus
} = require('../controllers/message.controller');

// Get all messages
router.get('/', getAllMessages);

// Get messages by room ID
router.get('/room/:roomId', getMessagesByRoomId);

// Get a single message by ID
router.get('/:id', getMessageById);

// Create a new message
router.post('/', createMessage);

// Update a message by ID
router.put('/:id', updateMessage);

// Mark message as read
router.patch('/:messageId/read', markMessageAsRead);

// Update message status
router.patch('/:messageId/status', updateMessageStatus);

// Delete a message by ID
router.delete('/:id', deleteMessage);

module.exports = router; 