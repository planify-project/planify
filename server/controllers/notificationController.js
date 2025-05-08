const { Notification } = require('../database');

const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.params.userId },
      order: [['created_at', 'DESC']],
    });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Error getting notifications' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.is_read = true;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating notification' });
  }
};

module.exports = {
  getNotificationsByUser,
  markAsRead,
};
