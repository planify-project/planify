// routes/bookingRoutes.js
const express = require('express');
const { createBooking, getBookings, getBookingById, updateBooking, deleteBooking, respondToBooking } = require('../controllers/bookingController');
const router = express.Router();

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.put('/:bookingId/respond', respondToBooking);

module.exports = router;