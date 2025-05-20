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

// GET /api/events/:id
router.get('/:id', eventsController.getEventById);

// POST /api/events
router.post('/', eventsController.createEvent);

// DELETE /api/events/:id
router.delete('/:id', eventsController.deleteEvent);

module.exports = router; 
