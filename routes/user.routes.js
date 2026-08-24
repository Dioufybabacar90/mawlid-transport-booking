const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation.middleware');

// Get current user profile
router.get('/profile', authMiddleware, userController.getProfile);

// Update user profile
router.put(
  '/profile',
  authMiddleware,
  [
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
    body('phone').optional().trim(),
  ],
  handleValidationErrors,
  userController.updateProfile
);

// Get user bookings
router.get('/bookings', authMiddleware, userController.getUserBookings);

// Change password
router.post(
  '/change-password',
  authMiddleware,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
  handleValidationErrors,
  userController.changePassword
);

module.exports = router;
