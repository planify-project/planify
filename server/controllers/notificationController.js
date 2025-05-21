const { Notification, Booking, Service, User } = require('../database');

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('1. Getting notifications for user:', userId);

    if (!userId) {
      console.log('Error: No userId provided');
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // First, let's check if the user exists
    const user = await User.findByPk(userId);
    console.log('2. User check:', user ? {
      id: user.id,
      name: user.name,
      email: user.email
    } : 'User not found');

    if (!user) {
      console.log('Error: User not found in database');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get notifications with more detailed query and force fresh data
    const notifications = await Notification.findAll({
      where: { 
        userId: userId 
      },
      order: [['createdAt', 'DESC']],
      include: [{
        model: Booking,
        include: [{
          model: Service,
          attributes: ['id', 'title', 'provider_id']
        }]
      }],
      logging: (sql, timing) => {
        console.log('3. SQL Query:', sql);
        console.log('4. Query timing:', timing, 'ms');
      }
    });

    console.log('5. Found notifications count:', notifications.length);

    // Set cache control headers to prevent caching
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.json({
      success: true,
      data: notifications,
      timestamp: new Date().toISOString() // Add timestamp to force fresh data
    });
  } catch (err) {
    console.error('Error getting notifications:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({
      success: false,
      message: 'Error getting notifications',
      error: err.message
    });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id, {
      include: [
        {
          model: Booking,
          include: [
            {
              model: Service,
              attributes: ['id', 'title', 'price']
            },
            {
              model: User,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!notification) {
      return res.status(404).json({ 
        success: false,
        message: 'Notification not found' 
      });
    }

    res.status(200).json(notification);
  } catch (err) {
    console.error('Error getting notification:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error getting notification',
      error: err.message 
    });
  }
};

const createNotification = async (req, res) => {
  try {
    console.log('1. Creating notification with data:', req.body);
    const notification = await Notification.create(req.body);
    console.log('2. Created notification:', notification.toJSON());
    res.json({
      success: true,
      data: notification
    });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error creating notification',
      error: err.message 
    });
  }
};

// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ 
        success: false,
        message: 'Notification not found' 
      });
    }
    await notification.update(req.body);
    res.status(200).json(notification);
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error updating notification',
      error: err.message 
    });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body; // To ensure user can only delete their own notifications

    console.log('1. Deleting notification:', { notificationId, userId });

    const notification = await Notification.findOne({
      where: { 
        id: notificationId,
        userId: userId 
      }
    });

    if (!notification) {
      console.log('2. Notification not found or unauthorized');
      return res.status(404).json({ 
        success: false,
        message: "Notification not found or unauthorized"
      });
    }

    console.log('2. Found notification:', {
      id: notification.id,
      userId: notification.userId,
      type: notification.type
    });

    await notification.destroy();
    console.log('3. Deleted notification');

    // Notify client through socket
    const io = req.app.get('io');
    io.to(`user_${userId}`).emit('notificationDeleted', {
      notificationId: notification.id
    });

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete notification",
      error: error.message
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    console.log('1. Marking notification as read:', notificationId);

    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      console.log('2. Notification not found:', notificationId);
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.update({ is_read: true });
    console.log('3. Updated notification:', notification.toJSON());

    res.json({
      success: true,
      data: notification
    });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: err.message
    });
  }
};

// Add test endpoint
const createTestNotification = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Creating test notification for user:', userId);

    const notification = await Notification.create({
      userId: userId,
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'test',
      is_read: false
    });

    console.log('Created test notification:', notification.toJSON());

    res.json({
      success: true,
      data: notification
    });
  } catch (err) {
    console.error('Error creating test notification:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating test notification',
      error: err.message
    });
  }
};

const dismissNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body; // Add userId to verify ownership
    
    console.log('1. Dismissing notification:', { notificationId, userId });

    const notification = await Notification.findOne({
      where: { 
        id: notificationId,
        userId: userId 
      }
    });
    
    if (!notification) {
      console.log('2. Notification not found or unauthorized');
      return res.status(404).json({
        success: false,
        message: "Notification not found or unauthorized"
      });
    }

    console.log('2. Found notification:', {
      id: notification.id,
      userId: notification.userId,
      type: notification.type
    });

    // Mark notification as read
    await notification.update({ is_read: true });
    console.log('3. Updated notification:', notification.toJSON());

    // Notify client through socket
    const io = req.app.get('io');
    io.to(`user_${userId}`).emit('notificationDismissed', {
      notificationId: notification.id,
      is_read: true
    });

    res.json({
      success: true,
      data: notification,
      message: "Notification dismissed successfully"
    });
  } catch (error) {
    console.error("Error dismissing notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to dismiss notification",
      error: error.message
    });
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  markAsRead,
  createTestNotification,
  dismissNotification
};
