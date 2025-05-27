const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");

// Create payment intent
router.post("/payment", stripeController.createPaymentIntent);

// Handle Stripe webhooks
router.post("/webhook", express.raw({type: 'application/json'}), stripeController.handleWebhook);

module.exports = router; 