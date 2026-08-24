const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { handleValidationErrors } = require('../middleware/validation.middleware');

// Register
router.post(
  '/register',
  [
    body('firstName').notEmpty().trim(),
    body('lastName').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('phone').notEmpty().trim(),
    body('password').isLength({ min: 6 }),
  ],
  handleValidationErrors,
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  handleValidationErrors,
  authController.login
);

// Verify Email (placeholder)
router.post('/verify-email', authController.verifyEmail);

// Forgot Password (placeholder)
router.post('/forgot-password', authController.forgotPassword);

// Reset Password (placeholder)
router.post('/reset-password', authController.resetPassword);

module.exports = router;
