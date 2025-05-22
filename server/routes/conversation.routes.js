const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');

// Create a new conversation (must come before /:id route)
router.post('/create', conversationController.createConversation);

// Get all conversations
router.get('/getAll', conversationController.getAllConversations);

// Get conversations by user ID
router.get('/user/:userId', conversationController.getConversationsByUserId);

// Get a conversation between two users
router.get('/user/:userId/other/:otherUserId', conversationController.getConversationByUserIds);

// Get messages between two users
router.get('/user/:userId/other/:otherUserId/messages', conversationController.getMessagesByUserIds);

// Get a conversation by ID (must come after all specific routes)
router.get('/:id', conversationController.getConversationById);

// Update a conversation by ID
router.put('/:id', conversationController.updateConversation);

// Delete a conversation by ID
router.delete('/:id', conversationController.deleteConversation);

module.exports = router;