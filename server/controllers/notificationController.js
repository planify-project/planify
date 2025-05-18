const { Notification, User, Booking, Service } = require('../database');

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;
    const notifications = await Notification.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Booking,
          include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
            { model: Service, attributes: ['id', 'title', 'description'] }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const notification = await Notification.findByPk(notification_id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.is_read = true;
    await notification.save();

    // Get socket instance
    const io = req.app.get('io');
    if (io) {
      // Emit notification update to user's room
      io.to(`user_${notification.user_id}`).emit('notification_updated', {
        type: 'notification_read',
        notification_id: notification.id,
        is_read: true
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { user_id } = req.params;
    await Notification.update(
      { is_read: true },
      { where: { user_id, is_read: false } }
    );

    // Get socket instance
    const io = req.app.get('io');
    if (io) {
      // Emit notification update to user's room
      io.to(`user_${user_id}`).emit('notifications_updated', {
        type: 'all_notifications_read',
        user_id: user_id
      });
    }

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const notification = await Notification.findByPk(notification_id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.destroy();

    // Get socket instance
    const io = req.app.get('io');
    if (io) {
      // Emit notification deletion to user's room
      io.to(`user_${notification.user_id}`).emit('notification_deleted', {
        type: 'notification_deleted',
        notification_id: notification.id
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

// Get unread notification count for a user
const getUnreadNotificationCount = async (req, res) => {
  try {
    const { user_id } = req.params;
    const count = await Notification.count({
      where: { user_id, is_read: false }
    });

    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread notification count',
      error: error.message
    });
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount
};
