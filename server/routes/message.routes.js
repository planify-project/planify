// routes/message.router.js

const express = require('express');
const router = express.Router();
const { createMessage, deleteMessage, getAllMessages, getMessageById, getMessagesByRoomId,updateMessage} = require('../controllers/message.controller');

// Create a new message
router.post('/', createMessage);

// Get all messages
router.get('/', getAllMessages);

// Get messages by room ID
router.get('/room/:roomId', getMessagesByRoomId);

// Get a single message by ID
router.get('/:id', getMessageById);

// Update a message by ID
router.put('/:id', updateMessage);

// Delete a message by ID
router.delete('/:id', deleteMessage);

module.exports = router; 