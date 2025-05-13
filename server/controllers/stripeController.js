const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const { amount, currency = "usd" } = req.body; // (or use your event's price, etc.)
  try {
    const intent = await stripe.paymentIntents.create({ amount, currency });
    res.status(200).json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = createPaymentIntent; 