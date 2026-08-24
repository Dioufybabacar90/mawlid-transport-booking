const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

exports.processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, amount } = req.body;

    // Validate booking
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Process payment based on method
    let transactionId = `TXN-${Date.now()}`;

    // Create payment record
    const payment = await Payment.create({
      bookingId,
      userId: req.user.id,
      amount: amount || booking.totalPrice,
      paymentMethod,
      transactionId,
      status: 'success',
    });

    // Update booking payment status
    await booking.update({ paymentStatus: 'paid', status: 'confirmed' });

    res.status(201).json({
      message: 'Payment processed successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error: error.message });
  }
};

exports.handlePaymentWebhook = async (req, res) => {
  try {
    // Handle Stripe/PayPal webhooks here
    const { type, data } = req.body;

    // Update payment status based on webhook type
    if (type === 'payment.success') {
      const payment = await Payment.findOne({ where: { transactionId: data.transactionId } });
      if (payment) {
        await payment.update({ status: 'success' });
      }
    } else if (type === 'payment.failed') {
      const payment = await Payment.findOne({ where: { transactionId: data.transactionId } });
      if (payment) {
        await payment.update({ status: 'failed' });
      }
    }

    res.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing webhook', error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};
