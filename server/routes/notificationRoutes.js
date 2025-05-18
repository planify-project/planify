const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount
} = require('../controllers/notificationController');

// Get all notifications for a user
router.get('/user/:user_id', getUserNotifications);

// Get unread notification count for a user
router.get('/user/:user_id/unread/count', getUnreadNotificationCount);

// Mark a notification as read
router.patch('/:notification_id/read', markNotificationAsRead);

// Mark all notifications as read for a user
router.patch('/user/:user_id/read-all', markAllNotificationsAsRead);

// Delete a notification
router.delete('/:notification_id', deleteNotification);

module.exports = router;