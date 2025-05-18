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

// GET /api/events/search
router.get('/search', eventsController.searchEvents);

// POST /api/events
router.post('/', eventsController.createEvent);

module.exports = router; 
