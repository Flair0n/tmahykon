// backend/razorpay.cjs
require("dotenv").config();
const express = require('express');

const cors = require("cors");
const app = express();

// Razorpay webhook endpoint for payment confirmation (webhook secret only)
app.post('/api/razorpay-webhook', express.json({ type: 'application/json' }), (req, res) => {
  // Use only the webhook secret for verification
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);
  const crypto = require('crypto');
  const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
  if (signature === expectedSignature) {
    // Payment is verified, you can process the event
    // Example: log or store payment info
    console.log('Webhook payment event:', req.body);
    // TODO: Store payment status in your database (e.g., Firestore)
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(400).json({ status: 'invalid signature' });
  }
});

// Create Razorpay Payment Link endpoint
app.post('/api/create-payment-link', async (req, res) => {
  const { amount, name, email, contact, description } = req.body;
  try {
    const paymentLink = await razorpay.paymentLink.create({
      amount,
      currency: 'INR',
      description: description || 'Registration Fee',
      customer: {
        name,
        email,
        contact
      },
      notify: {
        sms: true,
        email: true
      },
      callback_url: 'http://localhost:3001/payment-success',
      callback_method: 'get',
    });
    res.json({ url: paymentLink.short_url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment link', details: err.message });
  }
});
// Verify payment link status using Razorpay API
app.get('/api/verify-payment-link', async (req, res) => {
  const payment_id = req.query.payment_id;
  if (!payment_id) return res.status(400).json({ success: false, error: 'Missing payment_id' });
  try {
    const payment = await razorpay.payments.fetch(payment_id);
    res.json({ success: true, status: payment.status, payment });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch payment status' });
  }
});

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
app.listen(PORT, () => {
  console.log(`Razorpay backend running on port ${PORT}`);
});
