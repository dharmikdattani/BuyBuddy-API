const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const payment = async (req, res) => {
  try {
    const { total_stripe_amount_paid, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total_stripe_amount_paid * 100,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const data = {
      stripe_client_secret: paymentIntent.client_secret,
    };

    res.json({
      success: true,
      message: "Payment Added in stripe Successfully!",
      data,
    });

  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ success: false, message: "An error occurred", error });
  }
};

module.exports = { payment };
