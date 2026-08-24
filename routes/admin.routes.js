const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

// Get dashboard statistics
router.get('/dashboard/stats', authMiddleware, adminMiddleware, adminController.getDashboardStats);

// Get all users
router.get('/users', authMiddleware, adminMiddleware, adminController.getAllUsers);

// Get all trips
router.get('/trips', authMiddleware, adminMiddleware, adminController.getAllTrips);

// Get all bookings
router.get('/bookings', authMiddleware, adminMiddleware, adminController.getAllBookings);

// Get all payments
router.get('/payments', authMiddleware, adminMiddleware, adminController.getAllPayments);

// Ban/unban user
router.post('/users/:id/toggle-status', authMiddleware, adminMiddleware, adminController.toggleUserStatus);

module.exports = router;
