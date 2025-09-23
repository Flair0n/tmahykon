// backend/razorpay.cjs
require("dotenv").config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require("cors");
const crypto = require('crypto');
const Razorpay = require('razorpay');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load Razorpay keys from .env
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '***HIDDEN***' : 'MISSING');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order for payment
app.post('/api/create-order', async (req, res) => {
  console.log('Received create-order request:', req.body);
  const { amount, currency = 'INR', receipt } = req.body;
  
  // Validate required fields
  if (!amount || amount <= 0) {
    console.error('Invalid amount:', amount);
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }
  
  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt || 'order_rcptid_' + Date.now(),
    });
    console.log('Order created successfully:', order.id);
    res.json({ success: true, order });
  } catch (err) {
    console.error('Order creation failed:', err);
    res.status(500).json({ success: false, error: 'Order creation failed' });
  }
});

// Verify payment
app.post('/api/verify-payment', async (req, res) => {
  console.log('Received verify-payment request:', req.body);
  const { payment_id, order_id } = req.body;
  
  if (!payment_id || !order_id) {
    console.error('Missing payment_id or order_id:', { payment_id, order_id });
    return res.status(400).json({ success: false, error: 'Missing payment_id or order_id' });
  }
  
  try {
    console.log('Fetching payment details for payment_id:', payment_id);
    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(payment_id);
    
    console.log('Payment details received:', {
      payment_id: payment.id,
      order_id: payment.order_id,
      status: payment.status,
      expected_order_id: order_id
    });
    
    if (payment.order_id === order_id && (payment.status === 'captured' || payment.status === 'authorized')) {
      console.log('Payment verification successful');
      res.json({ success: true, status: payment.status, payment });
    } else {
      console.log('Payment verification failed:', {
        order_match: payment.order_id === order_id,
        status: payment.status,
        expected_status: 'captured or authorized'
      });
      res.json({ success: false, status: payment.status });
    }
  } catch (err) {
    console.error('Payment verification failed:', err);
    res.status(500).json({ success: false, error: 'Payment verification failed' });
  }
});

// Verify payment link status using Razorpay API (for legacy support)
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

// Create Razorpay Payment Link endpoint (for legacy support)
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
  callback_url: 'https://tmahykon.inkeredu.com/payment-success',
      callback_method: 'get',
    });
    res.json({ url: paymentLink.short_url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment link', details: err.message });
  }
});

// Razorpay webhook endpoint for payment confirmation
app.post('/api/razorpay-webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  const body = req.body;
  
  const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
  
  if (signature === expectedSignature) {
    console.log('Webhook payment event:', JSON.parse(body));
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(400).json({ status: 'invalid signature' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Razorpay backend running on port ${PORT}`);
});
