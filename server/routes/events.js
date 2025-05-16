const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// GET /api/events
router.get('/getAll', eventsController.getAllEvents);
router.get('/public', eventsController.getPublicEvents);
// admin
router.put('/status/:id',  eventsController.updateStatus);
router.get('/status-summary', eventsController.getStatusSummary);
router.get('/events-this-month', eventsController.getAllEventsAdmin);
router.get('/private-events-this-year', eventsController.getPrivateEventsThisYear);
router.get('/public-events-this-year', eventsController.getPublicEventsThisYear);
router.get('/event-status-distribution', eventsController.getEventStatusDistribution);

module.exports = router;