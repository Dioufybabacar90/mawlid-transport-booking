const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const { v4: uuidv4 } = require('uuid');

exports.createBooking = async (req, res) => {
  try {
    const { tripId, seatsBooked, specialRequests } = req.body;

    // Find trip
    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check available seats
    if (trip.availableSeats < seatsBooked) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Calculate total price
    const totalPrice = seatsBooked * trip.pricePerSeat;

    // Create booking
    const booking = await Booking.create({
      tripId,
      userId: req.user.id,
      seatsBooked,
      totalPrice,
      bookingReference: `BOOK-${Date.now()}-${uuidv4().substring(0, 8)}`,
      specialRequests,
    });

    // Update available seats
    await trip.update({
      availableSeats: trip.availableSeats - seatsBooked,
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [Trip],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await booking.update(req.body);

    res.status(200).json({
      message: 'Booking updated successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update booking status
    await booking.update({ status: 'cancelled' });

    // Return seats to trip
    const trip = await Trip.findByPk(booking.tripId);
    await trip.update({
      availableSeats: trip.availableSeats + booking.seatsBooked,
    });

    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
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
