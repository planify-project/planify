const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Payment, User } = require('../database');

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd", eventId, serviceId, userId } = req.body;

    // Validate required fields
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Convert amount to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Create payment intent with metadata
    const intent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      metadata: {
        eventId: eventId || null,
        serviceId: serviceId || null,
        userId: userId
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the client secret
    res.status(200).json({
      client_secret: intent.client_secret,
      payment_intent_id: intent.id
    });
  } catch (err) {
    console.error('Stripe payment intent creation error:', err);
    
    // Handle specific Stripe errors
    if (err.type === 'StripeCardError') {
      return res.status(400).json({ error: err.message });
    } else if (err.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: 'Invalid payment request' });
    } else if (err.type === 'StripeAPIError') {
      return res.status(503).json({ error: 'Payment service temporarily unavailable' });
    }

    // Generic error response
    res.status(500).json({ 
      error: 'An error occurred while processing your payment',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const { userId, eventId, serviceId } = paymentIntent.metadata;
        
        // Create payment record in database
        await Payment.create({
          user_id: userId,
          event_id: eventId || null,
          service_id: serviceId || null,
          amount: paymentIntent.amount / 100, // Convert from cents to dollars
          method: 'transfer',
          status: 'completed'
        });

        console.log('Payment recorded successfully:', {
          paymentIntentId: paymentIntent.id,
          userId,
          amount: paymentIntent.amount / 100
        });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', {
          paymentIntentId: failedPayment.id,
          error: failedPayment.last_payment_error
        });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).json({ error: 'Error processing webhook' });
  }
};

module.exports = {
  createPaymentIntent,
  handleWebhook
}; 