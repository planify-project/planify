const express = require('express');
const router = express.Router();
const eventSpaceController = require('../controllers/eventSpaceController');

router.get('/', eventSpaceController.getAllEventSpaces);
router.get('/:id', eventSpaceController.getEventSpaceById);
router.post('/', eventSpaceController.createEventSpace);
router.put('/:id', eventSpaceController.updateEventSpace);
router.get('/:id/availability', eventSpaceController.checkAvailability);

module.exports = router;