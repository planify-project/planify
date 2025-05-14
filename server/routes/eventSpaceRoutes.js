const express = require('express');
const router = express.Router();
const eventSpaceController = require('../controllers/eventSpaceController');

// GET /api/event-spaces
router.get('/', eventSpaceController.getAllEventSpaces);

// GET /api/event-spaces/:id
router.get('/:id', eventSpaceController.getEventSpaceById);

module.exports = router;