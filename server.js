require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Use environment variable

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image_url], // Optional: Add product images
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `https://next-js-formik-form-git-master-naveedbasharat06s-projects.vercel.app/paymentSuccess`, // Redirect after successful payment
      cancel_url: `https://next-js-formik-form-git-master-naveedbasharat06s-projects.vercel.app/paymentCancel`, // Redirect if payment is canceled
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Checkout Session:", error);
    res.status(500).json({ error: "Failed to create Checkout Session" });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
