const express = require('express');
const router = express.Router();
const { Payment } = require('../database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getRevenue, getPayments, updatePaymentStatus } = require('../controllers/paymentController');

// Get all payments
router.get('/', getPayments);

// Get revenue statistics
router.get('/revenue', getRevenue);

// Update payment status
router.put('/:id/status', updatePaymentStatus);

// Create payment record
router.post('/', async (req, res) => {
  try {
    const { user_id, event_id, service_id, amount, method, status, payment_intent_id } = req.body;

    console.log('Received payment data:', req.body);

    // Validate required fields
    if (!user_id || !amount || !method || !status || !payment_intent_id) {
      console.error('Missing required fields:', { user_id, amount, method, status, payment_intent_id });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify the payment intent with Stripe
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          message: 'Payment has not been completed'
        });
      }

      // Check if payment record already exists
      const existingPayment = await Payment.findOne({
        where: { payment_intent_id }
      });

      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: 'Payment record already exists'
        });
      }

      // Create payment record
      const payment = await Payment.create({
        user_id,
        event_id: event_id || null,
        service_id: service_id || null,
        amount: parseFloat(amount),
        method: 'transfer',
        status: 'completed',
        payment_intent_id
      });

      console.log('Payment record created:', payment.toJSON());

      res.status(201).json({
        success: true,
        data: payment,
        message: 'Payment record created successfully'
      });
    } catch (stripeError) {
      console.error('Stripe verification error:', stripeError);
      return res.status(400).json({
        success: false,
        message: 'Invalid payment intent'
      });
    }
  } catch (error) {
    console.error('Error creating payment record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment record',
      error: error.message
    });
  }
});

module.exports = router;
