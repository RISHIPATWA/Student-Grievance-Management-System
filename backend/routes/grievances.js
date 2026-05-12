const express = require('express');
const Booking = require('../models/Grievance'); // Still using Grievance.js filename but now exports Booking model
const auth = require('../middleware/auth');
const router = express.Router();

// Create a booking
router.post('/', auth, async (req, res) => {
  try {
    const { destinationName, travelDate, numberOfTravelers, packageType, price, contactAddress } = req.body;

    const booking = new Booking({
      destinationName,
      travelDate,
      numberOfTravelers,
      packageType,
      price,
      contactAddress,
      user: req.student.id
    });

    await booking.save();
    await booking.populate('user', 'name email mobileNumber');

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.student.id })
      .populate('user', 'name email mobileNumber')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email mobileNumber');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the logged-in user
    if (booking.user._id.toString() !== req.student.id) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a booking
router.put('/:id', auth, async (req, res) => {
  try {
    const { destinationName, travelDate, numberOfTravelers, packageType, price, contactAddress, bookingStatus } = req.body;
    
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the logged-in user
    if (booking.user.toString() !== req.student.id) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { destinationName, travelDate, numberOfTravelers, packageType, price, contactAddress, bookingStatus },
      { new: true, runValidators: true }
    ).populate('user', 'name email mobileNumber');

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the logged-in user
    if (booking.user.toString() !== req.student.id) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search bookings by destination
router.get('/search', auth, async (req, res) => {
  try {
    const { destination } = req.query;
    
    if (!destination) {
      return res.status(400).json({ message: 'Destination parameter is required for search' });
    }

    const bookings = await Booking.find({
      user: req.student.id,
      destinationName: { $regex: destination, $options: 'i' }
    }).populate('user', 'name email mobileNumber').sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
