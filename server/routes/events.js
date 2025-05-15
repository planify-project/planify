const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// GET /api/events
router.get('/getAll', eventsController.getAllEvents);
router.get('/public', eventsController.getPublicEvents);
// admin
router.put('/status/:id',  eventsController.updateStatus);
module.exports = router; 