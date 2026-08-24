const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { authMiddleware, driverMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation.middleware');

// Get all trips (public)
router.get('/', tripController.getAllTrips);

// Search trips
router.get('/search', tripController.searchTrips);

// Get trip details
router.get('/:id', tripController.getTripById);

// Create trip (driver only)
router.post(
  '/',
  authMiddleware,
  driverMiddleware,
  [
    body('departureCity').notEmpty().trim(),
    body('arrivalCity').notEmpty().trim(),
    body('departureTime').isISO8601(),
    body('arrivalTime').isISO8601(),
    body('totalSeats').isInt({ min: 1 }),
    body('pricePerSeat').isDecimal({ force_decimal: true }),
  ],
  handleValidationErrors,
  tripController.createTrip
);

// Update trip (driver only)
router.put(
  '/:id',
  authMiddleware,
  driverMiddleware,
  tripController.updateTrip
);

// Cancel trip (driver/admin only)
router.delete('/:id', authMiddleware, driverMiddleware, tripController.cancelTrip);

module.exports = router;
