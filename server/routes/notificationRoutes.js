const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Notifications API is working',
    timestamp: new Date().toISOString()
  });
});

// Create test notification
router.post('/test/:userId', notificationController.createTestNotification);

// Get notifications by user (keep this first to avoid conflicts)
router.get('/user/:userId', notificationController.getNotificationsByUser);

// Get single notification
router.get('/single/:id', notificationController.getNotificationById);

// Create notification
router.post('/', notificationController.createNotification);

// Update notification
router.put('/:id', notificationController.updateNotification);

// Delete notification
router.delete('/:notificationId', notificationController.deleteNotification);

// Mark notification as read
router.patch('/:notificationId/read', notificationController.markAsRead);

// Dismiss notification
router.put('/:notificationId/dismiss', notificationController.dismissNotification);



module.exports = router;