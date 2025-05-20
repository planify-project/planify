const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// Create review (requires session)
router.post('/event', reviewController.createReview);

// Get reviews for event (public)
router.get('/event/:event_id', reviewController.getReviewsByEvent);

// Get reviews for service (public)
router.get('/service/:service_id', reviewController.getReviewsByService);

module.exports = router;