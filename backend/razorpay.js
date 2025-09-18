// backend/razorpay.js

require("dotenv").config();
const express = require('express');
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Load Razorpay keys from .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: 'order_rcptid_' + Date.now(),
    });
    res.json({ orderId: order.id });
  } catch (err) {
    res.status(500).json({ error: 'Order creation failed' });
  }
});

// Verify payment endpoint
app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');
  if (generated_signature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Razorpay backend running on port ${PORT}`));
