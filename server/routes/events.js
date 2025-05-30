const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// admin
router.get('/getAll', eventsController.getAllEventsAdmin);
router.put('/status/:id',  eventsController.updateStatus);
router.get('/status-summary', eventsController.getStatusSummary);
router.get('/events-this-month', eventsController.getAllEventsAdmin);
router.get('/private-events-this-year', eventsController.getPrivateEventsThisYear);
router.get('/public-events-this-year', eventsController.getPublicEventsThisYear);
router.get('/event-status-distribution', eventsController.getEventStatusDistribution);
router.put('/admin-update/:id', eventsController.adminUpdateEvent);
router.get('/types', eventsController.getEventTypes);


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

// POST /api/events/register
router.post('/register', eventsController.registerForEvent);

// PUT /api/events/:id
router.put('/:id', eventsController.updateEvent);

// DELETE /api/events/:id
router.delete('/:id', eventsController.deleteEvent);

module.exports = router;

