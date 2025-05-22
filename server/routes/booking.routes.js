// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST /api/bookings
router.post('/', bookingController.createBooking);

// GET /api/bookings
router.get('/', bookingController.getBookings);

// GET /api/bookings/user/:userId
router.get('/user/:userId', bookingController.getUserBookings);

// GET /api/bookings/provider/:providerId
router.get('/provider/:providerId', bookingController.getProviderBookings);

// GET /api/bookings/:id
router.get('/:id', bookingController.getBookingById);

// PUT /api/bookings/:bookingId/respond
router.put('/:bookingId/respond', bookingController.respondToBooking);

// PUT /api/bookings/:id
router.put('/:id', bookingController.updateBooking);

// DELETE /api/bookings/:id
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;