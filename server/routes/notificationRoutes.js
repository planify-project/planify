const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController'); // تأكد من هذا

router.get('/:userId', notificationController.getNotificationsByUser);
router.patch('/:notificationId/read', notificationController.markAsRead);

module.exports = router;