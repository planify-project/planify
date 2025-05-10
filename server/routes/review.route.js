const express = require('express');
const router = express.Router();
const { createReview, getReviewsForService } = require('../controllers/review.controller.js');

router.post('/post', createReview);
router.get('/service/:serviceId', getReviewsForService);

module.exports = router;
