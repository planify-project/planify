const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd", eventId, serviceId } = req.body;

    // Validate required fields
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Convert amount to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Create payment intent with metadata
    const intent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      metadata: {
        eventId: eventId || null,
        serviceId: serviceId || null
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

module.exports = createPaymentIntent; 