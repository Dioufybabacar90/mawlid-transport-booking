const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation.middleware');

// Create booking
router.post(
  '/',
  authMiddleware,
  [
    body('tripId').notEmpty(),
    body('seatsBooked').isInt({ min: 1 }),
  ],
  handleValidationErrors,
  bookingController.createBooking
);

// Get booking details
router.get('/:id', authMiddleware, bookingController.getBookingById);

// Update booking
router.put('/:id', authMiddleware, bookingController.updateBooking);

// Cancel booking
router.delete('/:id', authMiddleware, bookingController.cancelBooking);

// Get all bookings (admin only)
router.get('/admin/all', authMiddleware, adminMiddleware, bookingController.getAllBookings);

module.exports = router;
