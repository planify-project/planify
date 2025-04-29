const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
// const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/register', agentController.register);
router.post('/login', agentController.login);

// Protected routes
router.get('/profile/:id', agentController.getAgentById);
router.put('/profile/:id', agentController.updateProfile);

// Admin routes
router.get('/all',  agentController.getAllAgents);
router.get('/pending',agentController.getPendingAgents);
router.put('/approve/:id', agentController.approveAgent);

module.exports = router; 