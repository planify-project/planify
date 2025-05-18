const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// GET /api/events
router.get('/', eventsController.getAllEvents);

// GET /api/events/public
router.get('/public', eventsController.getPublicEvents);

// GET /api/events/nearby
router.get('/nearby', eventsController.getNearbyEvents);

// GET /api/events/popular
router.get('/popular', eventsController.getPopularEvents);

// POST /api/events
router.post('/', eventsController.createEvent);
// admin
router.put('/status/:id',  eventsController.updateStatus);
router.get('/status-summary', eventsController.getStatusSummary);
router.get('/events-this-month', eventsController.getAllEventsAdmin);
router.get('/private-events-this-year', eventsController.getPrivateEventsThisYear);
router.get('/public-events-this-year', eventsController.getPublicEventsThisYear);
router.get('/event-status-distribution', eventsController.getEventStatusDistribution);

module.exports = router;