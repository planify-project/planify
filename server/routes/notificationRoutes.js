const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController'); // تأكد من هذا

router.get('/:userId', notificationController.getNotificationsByUser);
router.get('/single/:id', notificationController.getNotificationById);
router.post('/', notificationController.createNotification);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);
router.patch('/:notificationId/read', notificationController.markAsRead);

module.exports = router;