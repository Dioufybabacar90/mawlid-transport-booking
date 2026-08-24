const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

// Process payment
router.post('/process', authMiddleware, paymentController.processPayment);

// Get payment details
router.get('/:id', authMiddleware, paymentController.getPaymentById);

// Webhook for payment confirmation (from Stripe/PayPal)
router.post('/webhook', paymentController.handlePaymentWebhook);

// Get all payments (admin only)
router.get('/admin/all', authMiddleware, adminMiddleware, paymentController.getAllPayments);

module.exports = router;
