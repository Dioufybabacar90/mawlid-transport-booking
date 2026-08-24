const Trip = require('../models/Trip');
const { Op } = require('sequelize');

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { status: 'scheduled', isActive: true },
      order: [['departure_time', 'ASC']],
    });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
};

exports.searchTrips = async (req, res) => {
  try {
    const { departureCity, arrivalCity, departureDate } = req.query;

    const where = {};
    if (departureCity) where.departureCity = { [Op.iLike]: `%${departureCity}%` };
    if (arrivalCity) where.arrivalCity = { [Op.iLike]: `%${arrivalCity}%` };
    if (departureDate) {
      const date = new Date(departureDate);
      where.departureTime = {
        [Op.between]: [new Date(date.setHours(0, 0, 0, 0)), new Date(date.setHours(23, 59, 59, 999))],
      };
    }
    where.status = 'scheduled';
    where.isActive = true;

    const trips = await Trip.findAll({
      where,
      order: [['departure_time', 'ASC']],
    });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error searching trips', error: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trip', error: error.message });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const {
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      vehicleType,
      totalSeats,
      pricePerSeat,
      description,
    } = req.body;

    const trip = await Trip.create({
      driverId: req.user.id,
      departureCity,
      arrivalCity,
      departureTime,
      arrivalTime,
      vehicleType,
      totalSeats,
      availableSeats: totalSeats,
      pricePerSeat,
      description,
    });

    res.status(201).json({
      message: 'Trip created successfully',
      trip,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating trip', error: error.message });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.driverId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await trip.update(req.body);

    res.status(200).json({
      message: 'Trip updated successfully',
      trip,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating trip', error: error.message });
  }
};

exports.cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.driverId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await trip.update({ status: 'cancelled', isActive: false });

    res.status(200).json({
      message: 'Trip cancelled successfully',
      trip,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling trip', error: error.message });
  }
};
