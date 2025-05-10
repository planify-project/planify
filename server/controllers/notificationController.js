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

const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Error getting notification' });
  }
};

const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Error creating notification' });
  }
};

const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    await notification.update(req.body);
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Error updating notification' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    await notification.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting notification' });
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
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
};
