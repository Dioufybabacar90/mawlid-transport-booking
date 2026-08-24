const User = require('../models/User');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalTrips = await Trip.count();
    const totalBookings = await Booking.count();
    const totalRevenue = await Payment.sum('amount', { where: { status: 'success' } });

    const stats = {
      totalUsers,
      totalTrips,
      totalBookings,
      totalRevenue: totalRevenue || 0,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [Trip],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
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

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ isActive: !user.isActive });

    res.status(200).json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
};
