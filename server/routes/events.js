const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// GET /api/events
router.get('/', eventsController.getAllEvents);

// POST /api/events
router.post('/', eventsController.createEvent);

module.exports = router;