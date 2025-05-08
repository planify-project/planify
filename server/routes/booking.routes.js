// routes/bookingRoutes.js
const express = require('express');
const { createBooking, getBookings,respondToBooking } = require('../controllers/bookingController');
const router = express.Router();

router.post('/', createBooking);
router.get('/', getBookings);
router.put('/:bookingId/respond', respondToBooking);

module.exports = router;